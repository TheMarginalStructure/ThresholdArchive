#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
位图精准转矢量图 V30 - Kimi 贝塞尔曲线版
=========================================

针对黑白图标、文字、线稿、几何图形、圆弧的高精度矢量化工具。
本版本采用智能分段+贝塞尔曲线拟合技术，特别适合需要平滑曲线的场景。

核心特性：
  1. 智能分段：通过曲率分析自动检测拐角，将轮廓分为"直线段"和"曲线段"
  2. 直线段处理：正交化保持横平竖直，完美保留UI/文字的直角特征
  3. 曲线段处理：不进行正交化，避免阶梯锯齿
     - 阶梯消除：合并短阶梯边为斜线，还原平滑曲线
     - 贝塞尔拟合：用三次贝塞尔曲线(C命令)替代大量短直线段
     - 自适应分段：单条曲线误差过大时自动分割拟合
  4. nonzero填充规则：正确处理多层嵌套轮廓（孔洞中的孔洞）
  5. 所有坐标严格整数，确保SVG文件简洁精确

适用场景：
  - 包含圆弧、曲线的图标设计
  - 需要平滑曲线输出的矢量图形
  - 高精度Logo矢量化

依赖安装：
    pip install numpy pillow opencv-python

基本用法：
    python bitmap_to_vector_kimi.py input.png                    # 自动输出 input.svg
    python bitmap_to_vector_kimi.py input.png output.svg         # 指定输出文件名
    python bitmap_to_vector_kimi.py input.png --invert --eps 0.5 # 使用选项参数

参数说明：
    --invert          提取黑色前景（默认提取白色前景）
    --eps N           approxPolyDP容差像素（默认1.0，推荐0.5~3.0）
    --snap N          正交吸附容差像素（默认2.0）
    --threshold N     二值化阈值（默认128，-1=Otsu自动阈值）
    --corner-angle N  拐角检测角度阈值（默认30度，越小越敏感）
    --bezier-error N  贝塞尔拟合最大允许误差像素（默认1.5）

场景推荐：
  极致精细:  --eps 0.5 --bezier-error 0.8   （曲线最平滑，文件稍大）
  平衡模式:  --eps 1.0 --bezier-error 1.5   （推荐，肉眼无损）
  强压缩:    --eps 3.0 --bezier-error 3.0   （文件最小）
"""

import sys
import os
import re
import numpy as np
from PIL import Image
import cv2
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString


def bitmap_to_vector(image_path, output_svg_path,
                     threshold=128,
                     invert=False,
                     epsilon=1.0,
                     ortho_snap=2.0,
                     ignore_border=True,
                     corner_angle=30.0,
                     bezier_error=1.5):
    """
    位图精准转矢量图 V30
    """

    img = Image.open(image_path).convert('L')
    gray = np.array(img)
    h, w = gray.shape

    # 二值化
    if threshold == -1:
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    else:
        _, binary = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)

    if invert:
        binary = cv2.bitwise_not(binary)
        fill_color = '#000000'
    else:
        fill_color = '#ffffff'

    # 轮廓提取
    contours, hierarchy = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

    if hierarchy is None or len(contours) == 0:
        print("未提取到任何轮廓")
        return 0

    hierarchy = hierarchy[0]

    # 过滤轮廓
    valid_contours = []
    for i in range(len(contours)):
        cnt = contours[i]
        area = float(cv2.contourArea(cnt))

        if ignore_border:
            x, y, cw, ch = cv2.boundingRect(cnt)
            x, y, cw, ch = int(x), int(y), int(cw), int(ch)
            touches = (x <= 0 or y <= 0 or x + cw >= w or y + ch >= h)
            if touches and area > (w * h * 0.5):
                continue

        if area < 5:
            continue

        valid_contours.append(cnt)

    # 处理每个轮廓
    path_segments = []
    for cnt in valid_contours:
        # 智能分段：直线段 vs 曲线段
        segments = extract_segments(cnt, epsilon=epsilon, corner_angle_deg=corner_angle)

        processed = []
        for seg_type, pts in segments:
            if seg_type == 'line':
                # 直线段：正交化，保持横平竖直
                pts = orthogonalize_segment(pts, ortho_snap)
                processed.append(('line', pts))
            else:
                # 曲线段：消除阶梯 + 简化
                pts = remove_staircase(pts, max_step=3.0)
                if len(pts) > 10:
                    cnt_seg = pts.reshape(-1, 1, 2).astype(np.float32)
                    approx = cv2.approxPolyDP(cnt_seg, 2.0, False)
                    pts = approx.reshape(-1, 2)
                processed.append(('curve', pts))

        d = build_svg_path(processed, max_bezier_error=bezier_error)
        path_segments.append(d)

    # 构建SVG
    svg = Element('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'width': str(w),
        'height': str(h),
        'viewBox': '0 0 %d %d' % (w, h)
    })

    if path_segments:
        SubElement(svg, 'path', {
            'd': ' '.join(path_segments),
            'fill': fill_color,
            'fill-rule': 'nonzero',
            'stroke': 'none'
        })

    # 保存
    rough = tostring(svg, 'utf-8')
    reparsed = parseString(rough)
    pretty = reparsed.toprettyxml(indent='  ')

    with open(output_svg_path, 'w', encoding='utf-8') as f:
        f.write(pretty)

    total_points = sum(len(re.findall(r'[MLQC]\s+[\d\.,\s-]+', seg)) for seg in path_segments)
    print('转换完成: %s' % output_svg_path)
    print('  有效轮廓: %d' % len(path_segments))
    print('  总命令数: %d' % total_points)
    print('  文件大小: %.1f KB' % (os.path.getsize(output_svg_path) / 1024))

    return len(path_segments)


def extract_segments(cnt, epsilon=1.0, corner_angle_deg=30.0):
    """
    将轮廓分为直线段和曲线段。
    通过曲率分析检测拐角，在拐角之间形成段。
    """
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    pts = approx.reshape(-1, 2).astype(np.float32)
    n = len(pts)

    if n < 3:
        return [('line', pts)]

    # 计算每个点的转角，标记拐角
    corner_indices = []
    for i in range(n):
        p_prev = pts[(i - 1) % n]
        p_curr = pts[i]
        p_next = pts[(i + 1) % n]

        v1 = p_prev - p_curr
        v2 = p_next - p_curr

        len1 = np.linalg.norm(v1)
        len2 = np.linalg.norm(v2)

        if len1 < 0.5 or len2 < 0.5:
            continue

        cos_angle = np.dot(v1, v2) / (len1 * len2 + 1e-10)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.degrees(np.arccos(cos_angle))

        # 转角明显（< 150度）视为拐角
        if angle < (180.0 - corner_angle_deg):
            corner_indices.append(i)

    if not corner_indices:
        # 没有拐角，整体是平滑曲线（圆/椭圆等）
        return [('curve', pts)]

    corner_indices = sorted(set(corner_indices))

    # 按拐角分段
    segments = []
    start = corner_indices[0]

    for i in range(1, len(corner_indices)):
        end = corner_indices[i]
        if end <= start:
            continue

        seg_pts = pts[start:end + 1]
        seg_type = 'line' if is_straight(seg_pts, tolerance=3.0) else 'curve'
        segments.append((seg_type, seg_pts))
        start = end

    # 闭合段（最后一个拐角回到第一个拐角）
    end = corner_indices[0]
    if start != end:
        if end > start:
            seg_pts = pts[start:end + 1]
        else:
            seg_pts = np.vstack([pts[start:], pts[:end + 1]])

        seg_type = 'line' if is_straight(seg_pts, tolerance=3.0) else 'curve'
        segments.append((seg_type, seg_pts))

    return segments


def is_straight(pts, tolerance=3.0):
    """
    判断点序列是否近似共线。
    """
    if len(pts) <= 2:
        return True

    p0 = pts[0]
    pn = pts[-1]
    line = pn - p0
    line_len = np.linalg.norm(line)

    if line_len < 1.0:
        return True

    for p in pts[1:-1]:
        cross = abs(np.cross(line, p - p0))
        dist = cross / line_len
        if dist > tolerance:
            return False

    return True


def orthogonalize_segment(pts, snap=2.0, ratio=0.15):
    """
    对直线段进行正交化，强制水平/垂直边对齐。
    关键：不修改端点（拐角）坐标，确保与相邻段无缝连接。
    """
    result = pts.copy().astype(np.float32)
    n = len(pts)

    if n < 3:
        return np.round(result).astype(int)

    # 正交化内部边，端点保持不动
    for i in range(n - 1):
        p1 = result[i]
        p2 = result[i + 1]
        dx = abs(p2[0] - p1[0])
        dy = abs(p2[1] - p1[1])

        if dy < 1e-6:
            dy = 1e-6
        if dx < 1e-6:
            dx = 1e-6

        # 垂直边：dx/dy 很小
        if dx / dy < ratio and dy > 3.0:
            avg_x = round((p1[0] + p2[0]) / 2)
            if i > 0:
                result[i][0] = avg_x
            if i < n - 2:
                result[i + 1][0] = avg_x
        # 水平边：dy/dx 很小
        elif dy / dx < ratio and dx > 3.0:
            avg_y = round((p1[1] + p2[1]) / 2)
            if i > 0:
                result[i][1] = avg_y
            if i < n - 2:
                result[i + 1][1] = avg_y

    # 拐角修正：只修正内部拐角点
    for i in range(1, n - 1):
        p_prev = result[i - 1]
        p_curr = result[i]
        p_next = result[i + 1]

        v_in = p_prev - p_curr
        v_out = p_next - p_curr

        dx_in, dy_in = abs(v_in[0]), abs(v_in[1])
        dx_out, dy_out = abs(v_out[0]), abs(v_out[1])

        if dy_in < 1e-6:
            dy_in = 1e-6
        if dx_in < 1e-6:
            dx_in = 1e-6
        if dy_out < 1e-6:
            dy_out = 1e-6
        if dx_out < 1e-6:
            dx_out = 1e-6

        in_vert = (dx_in / dy_in < ratio) and dy_in > 3.0
        in_horiz = (dy_in / dx_in < ratio) and dx_in > 3.0
        out_vert = (dx_out / dy_out < ratio) and dy_out > 3.0
        out_horiz = (dy_out / dx_out < ratio) and dx_out > 3.0

        if (in_horiz and out_vert) or (in_vert and out_horiz):
            if in_horiz:
                result[i][1] = round(p_prev[1])
            if in_vert:
                result[i][0] = round(p_prev[0])
            if out_horiz:
                result[i][1] = round(p_next[1])
            if out_vert:
                result[i][0] = round(p_next[0])

    # 去重
    unique = [result[0]]
    for i in range(1, len(result)):
        if not np.allclose(result[i], unique[-1], atol=0.5):
            unique.append(result[i])

    return np.array(unique, dtype=int)


def remove_staircase(pts, max_step=3.0):
    """
    消除阶梯锯齿：检测交替的短水平/垂直边，合并为斜线。
    只处理明显斜向的阶梯，保留真正的水平/垂直段。
    """
    n = len(pts)
    if n < 4:
        return pts

    to_remove = set()

    i = 1
    while i < n - 1:
        # 寻找从i开始的连续短边
        j = i
        segments = []

        while j < n - 1:
            p_curr = pts[j]
            p_next = pts[j + 1]
            seg = p_next - p_curr
            length = np.linalg.norm(seg)

            if length > max_step * 1.5:
                break

            is_horiz = abs(seg[0]) >= abs(seg[1])
            segments.append((j, j + 1, is_horiz, length))
            j += 1

        # 至少3段短边且方向交替
        if len(segments) >= 3:
            alternating = True
            for k in range(len(segments) - 1):
                if segments[k][2] == segments[k + 1][2]:
                    alternating = False
                    break

            if alternating:
                start_pt = pts[segments[0][0]]
                end_pt = pts[segments[-1][1]]
                total_dx = abs(end_pt[0] - start_pt[0])
                total_dy = abs(end_pt[1] - start_pt[1])

                # 整体趋势是斜向的才合并
                if total_dx > max_step and total_dy > max_step:
                    for k in range(1, len(segments)):
                        to_remove.add(segments[k][0])
                    i = j
                    continue

        i += 1

    if not to_remove:
        return pts

    return np.array([p for idx, p in enumerate(pts) if idx not in to_remove])


def fit_cubic_bezier_ls(pts):
    """
    最小二乘法拟合三次贝塞尔曲线。
    返回: (p0, c1, c2, p3)
    """
    n = len(pts)
    if n < 2:
        return None

    p0 = np.array(pts[0], dtype=np.float64)
    p3 = np.array(pts[-1], dtype=np.float64)

    if n == 2:
        c1 = p0 + (p3 - p0) * 0.3
        c2 = p3 - (p3 - p0) * 0.3
        return (p0, c1, c2, p3)

    if n == 3:
        q0, q1, q2 = [np.array(p, dtype=np.float64) for p in pts]
        c1 = q0 + (q1 - q0) * (2.0 / 3.0)
        c2 = q2 + (q1 - q2) * (2.0 / 3.0)
        return (q0, c1, c2, q2)

    # 弦长参数化
    t = [0.0]
    total_len = sum(np.linalg.norm(np.array(pts[i]) - np.array(pts[i - 1])) for i in range(1, n))

    if total_len < 0.1:
        c1 = p0 + (p3 - p0) * 0.3
        c2 = p3 - (p3 - p0) * 0.3
        return (p0, c1, c2, p3)

    cum_len = 0
    for i in range(1, n):
        cum_len += np.linalg.norm(np.array(pts[i]) - np.array(pts[i - 1]))
        t.append(cum_len / total_len)

    # 最小二乘: B(t) - (1-t)^3 P0 - t^3 P3 = 3(1-t)^2 t C1 + 3(1-t) t^2 C2
    A = []
    Bx = []
    By = []

    for i in range(n):
        ti = t[i]
        omti = 1.0 - ti
        a1 = 3.0 * omti * omti * ti
        a2 = 3.0 * omti * ti * ti

        bx = pts[i][0] - omti ** 3 * p0[0] - ti ** 3 * p3[0]
        by = pts[i][1] - omti ** 3 * p0[1] - ti ** 3 * p3[1]

        A.append([a1, a2])
        Bx.append(bx)
        By.append(by)

    A = np.array(A)
    Bx = np.array(Bx)
    By = np.array(By)

    try:
        Cx, _, _, _ = np.linalg.lstsq(A, Bx, rcond=None)
        Cy, _, _, _ = np.linalg.lstsq(A, By, rcond=None)
    except np.linalg.LinAlgError:
        c1 = p0 + (p3 - p0) * 0.3
        c2 = p3 - (p3 - p0) * 0.3
        return (p0, c1, c2, p3)

    c1 = np.array([Cx[0], Cy[0]])
    c2 = np.array([Cx[1], Cy[1]])

    return (p0, c1, c2, p3)


def adaptive_bezier_fit(pts, max_error=1.5, min_points=4):
    """
    自适应贝塞尔拟合：如果单条曲线误差过大，自动在中点分割。
    返回: [(cmd, points), ...]，cmd为'C'或'L'
    """
    if len(pts) <= min_points:
        return [('L', pts)]

    bezier = fit_cubic_bezier_ls(pts)
    if bezier is None:
        return [('L', pts)]

    p0, c1, c2, p3 = bezier

    # 计算拟合误差
    n = len(pts)
    t = [0.0]
    total_len = sum(np.linalg.norm(np.array(pts[i]) - np.array(pts[i - 1])) for i in range(1, n))

    if total_len < 0.1:
        return [('C', [p0, c1, c2, p3])]

    cum_len = 0
    for i in range(1, n):
        cum_len += np.linalg.norm(np.array(pts[i]) - np.array(pts[i - 1]))
        t.append(cum_len / total_len)

    max_err = 0
    worst_i = 0
    for i in range(n):
        ti = t[i]
        omti = 1.0 - ti
        b_x = (omti ** 3 * p0[0] +
               3 * omti ** 2 * ti * c1[0] +
               3 * omti * ti ** 2 * c2[0] +
               ti ** 3 * p3[0])
        b_y = (omti ** 3 * p0[1] +
               3 * omti ** 2 * ti * c1[1] +
               3 * omti * ti ** 2 * c2[1] +
               ti ** 3 * p3[1])

        err = np.sqrt((b_x - pts[i][0]) ** 2 + (b_y - pts[i][1]) ** 2)
        if err > max_err:
            max_err = err
            worst_i = i

    if max_err <= max_error:
        return [('C', [p0, c1, c2, p3])]
    else:
        # 在最大误差点分割
        if worst_i < 3:
            worst_i = 3
        if worst_i > n - 3:
            worst_i = n - 3

        left = adaptive_bezier_fit(pts[:worst_i + 1], max_error, min_points)
        right = adaptive_bezier_fit(pts[worst_i:], max_error, min_points)
        return left + right


def build_svg_path(segments, max_bezier_error=1.5):
    """
    从分段构建SVG路径字符串。
    直线段用 L 命令，曲线段用 C 命令（三次贝塞尔）。
    """
    d = ""
    first = True

    for seg_type, pts in segments:
        if len(pts) < 2:
            continue

        if first:
            d += "M %d,%d" % (int(round(pts[0][0])), int(round(pts[0][1])))
            first = False
        else:
            d += " L %d,%d" % (int(round(pts[0][0])), int(round(pts[0][1])))

        if seg_type == 'line':
            for p in pts[1:]:
                d += " L %d,%d" % (int(round(p[0])), int(round(p[1])))
        else:
            smoothed = remove_staircase(pts)

            if len(smoothed) <= 3:
                for p in smoothed[1:]:
                    d += " L %d,%d" % (int(round(p[0])), int(round(p[1])))
            else:
                beziers = adaptive_bezier_fit(smoothed, max_error=max_bezier_error)
                for cmd, bpts in beziers:
                    if cmd == 'C':
                        # bpts = [p0, c1, c2, p3]
                        c1x, c1y = int(round(bpts[1][0])), int(round(bpts[1][1]))
                        c2x, c2y = int(round(bpts[2][0])), int(round(bpts[2][1]))
                        px, py = int(round(bpts[3][0])), int(round(bpts[3][1]))
                        d += " C %d,%d %d,%d %d,%d" % (c1x, c1y, c2x, c2y, px, py)
                    else:
                        for p in bpts[1:]:
                            d += " L %d,%d" % (int(round(p[0])), int(round(p[1])))

    d += " Z"
    return d


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    if len(sys.argv) < 2:
        print('用法: python bitmap_to_vector_kimi.py <输入图片> [输出.svg] [选项]')
        print()
        print('选项:')
        print('  --invert         提取黑色前景（默认提取白色）')
        print('  --eps N          approxPolyDP容差像素（默认1.0）')
        print('  --snap N         正交吸附容差像素（默认2.0）')
        print('  --threshold N    二值化阈值（默认128，-1=Otsu自动）')
        print('  --corner-angle N 拐角检测角度阈值（默认30度）')
        print('  --bezier-error N 贝塞尔拟合最大误差像素（默认1.5）')
        print()
        print('场景推荐:')
        print('  极致精细:  --eps 0.5 --bezier-error 0.8')
        print('  平衡模式:  --eps 1.0 --bezier-error 1.5 （推荐）')
        print('  强压缩:    --eps 3.0 --bezier-error 3.0')
        print()
        print('示例:')
        print('  python bitmap_to_vector_kimi.py icon.png')
        print('  python bitmap_to_vector_kimi.py icon.png icon.svg')
        print('  python bitmap_to_vector_kimi.py icon.png --invert --eps 0.5 --bezier-error 0.8')
        sys.exit(1)

    input_path = sys.argv[1]
    
    output_path = sys.argv[2] if len(sys.argv) >= 3 and not sys.argv[2].startswith('--') else os.path.splitext(input_path)[0] + '.svg'

    if not os.path.exists(input_path):
        print('错误: 找不到文件 %s' % input_path)
        sys.exit(1)

    invert = '--invert' in sys.argv

    eps = 1.0
    if '--eps' in sys.argv:
        try:
            eps = float(sys.argv[sys.argv.index('--eps') + 1])
        except (IndexError, ValueError):
            pass

    snap = 2.0
    if '--snap' in sys.argv:
        try:
            snap = float(sys.argv[sys.argv.index('--snap') + 1])
        except (IndexError, ValueError):
            pass

    threshold = 128
    if '--threshold' in sys.argv:
        try:
            threshold = int(sys.argv[sys.argv.index('--threshold') + 1])
        except (IndexError, ValueError):
            pass

    corner_angle = 30.0
    if '--corner-angle' in sys.argv:
        try:
            corner_angle = float(sys.argv[sys.argv.index('--corner-angle') + 1])
        except (IndexError, ValueError):
            pass

    bezier_error = 1.5
    if '--bezier-error' in sys.argv:
        try:
            bezier_error = float(sys.argv[sys.argv.index('--bezier-error') + 1])
        except (IndexError, ValueError):
            pass

    bitmap_to_vector(
        input_path, output_path,
        threshold=threshold,
        invert=invert,
        epsilon=eps,
        ortho_snap=snap,
        ignore_border=True,
        corner_angle=corner_angle,
        bezier_error=bezier_error
    )


if __name__ == '__main__':
    main()
