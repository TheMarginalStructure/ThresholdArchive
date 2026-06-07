#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
位图精准转矢量图 V30 - 自适应平滑版
=====================================

针对黑白图标、文字、线稿、几何图形、圆弧的高精度矢量化工具。

核心特性：
  1. approxPolyDP几何简化（epsilon控制精度）
  2. 比例正交化：强制水平/垂直边对齐
  3. 拐角修正：直角拐角处强制坐标一致
  4. nonzero填充规则：正确处理多层嵌套轮廓
  5. 所有坐标严格整数，确保SVG文件简洁精确
  6. 不强行拟合曲线，避免椭圆检测错误
  7. 自适应平滑：仅平滑锯齿状共线顶点，智能保留角点（直角、尖角）
  8. 迭代平滑参数可调，灵活控制平滑程度

核心流程：
  轮廓提取 → approxPolyDP简化 → 比例正交化 → 自适应平滑 → SVG生成

依赖安装：
    pip install numpy pillow opencv-python

基本用法：
    python bitmap_to_vector_deepseek.py input.png                    # 自动输出 input.svg
    python bitmap_to_vector_deepseek.py input.png output.svg         # 指定输出文件名
    python bitmap_to_vector_deepseek.py input.png --invert --eps 0.5 # 使用选项参数

参数说明：
    --invert          提取黑色前景（默认提取白色前景）
    --eps N           approxPolyDP容差像素（默认1.0，推荐0.5~3.0）
    --snap N          正交吸附容差像素（默认2.0）
    --threshold N     二值化阈值（默认128，-1=Otsu自动阈值）
    --smooth-iter N   自适应平滑迭代次数（默认2，越大越平滑）
    --smooth-angle N  角度阈值（默认5.0度，小于此值的顶点被平滑）

场景推荐：
  极致精细:  --eps 0.5                    （圆弧几乎完美，点数多）
  平衡模式:  --eps 1.0                    （推荐，肉眼无损）
  强压缩:    --eps 3.0                    （文件最小）
  加强平滑:  --smooth-iter 3 --smooth-angle 8.0 （适合粗糙位图）
"""

import sys
import os
import re
import numpy as np
from PIL import Image
import cv2
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString


def smooth_polygon(pts, iterations=2, angle_threshold=5.0):
    """
    自适应平滑共线锯齿点，保留角点。
    pts: Nx2 numpy数组（闭合多边形，首尾可重复或不重复）
    iterations: 平滑迭代次数（越大越平滑，但可能轻微收缩）
    angle_threshold: 角度阈值（度），小于此值的顶点视为锯齿点并平滑
    """
    pts = pts.astype(np.float32)
    n = len(pts)
    if n < 4:
        return pts

    # 确保闭合（首尾相同）
    if not np.allclose(pts[0], pts[-1], atol=1e-3):
        pts = np.vstack([pts, pts[0]])

    for _ in range(iterations):
        new_pts = pts.copy()
        # 处理中间顶点
        for i in range(1, n):
            prev = pts[i-1]
            curr = pts[i]
            nxt = pts[i+1] if i+1 < len(pts) else pts[1]

            v1 = curr - prev
            v2 = nxt - curr
            len1 = np.linalg.norm(v1)
            len2 = np.linalg.norm(v2)
            if len1 < 1e-4 or len2 < 1e-4:
                continue

            cos_angle = np.dot(v1, v2) / (len1 * len2)
            cos_angle = np.clip(cos_angle, -1.0, 1.0)
            angle = np.degrees(np.arccos(cos_angle))
            if abs(angle - 180.0) < angle_threshold:
                new_pts[i] = (prev + nxt) / 2.0

        # 处理首点（闭合路径的最后一个顶点已在上一循环中处理，这里单独处理首点）
        prev = pts[-2]
        curr = pts[0]
        nxt = pts[1]
        v1 = curr - prev
        v2 = nxt - curr
        len1, len2 = np.linalg.norm(v1), np.linalg.norm(v2)
        if len1 > 1e-4 and len2 > 1e-4:
            cos_angle = np.dot(v1, v2) / (len1 * len2)
            cos_angle = np.clip(cos_angle, -1.0, 1.0)
            angle = np.degrees(np.arccos(cos_angle))
            if abs(angle - 180.0) < angle_threshold:
                new_pts[0] = (prev + nxt) / 2.0

        pts = new_pts

    # 移除由于平滑产生的过于接近的点（距离<0.5像素）
    unique = [pts[0]]
    for i in range(1, len(pts)-1):  # 最后一个点是重复的首点，暂不处理
        if np.linalg.norm(pts[i] - unique[-1]) > 0.5:
            unique.append(pts[i])
    # 确保闭合
    if len(unique) > 1 and np.linalg.norm(unique[0] - unique[-1]) > 0.5:
        unique.append(unique[0])
    return np.round(np.array(unique)).astype(int)


def orthogonalize(pts, snap=2.0):
    """
    比例正交化：基于dx/dy比例判断方向，强制对齐水平/垂直边
    """
    n = len(pts)
    if n < 3:
        return np.round(pts).astype(int)

    result = pts.astype(np.float32)
    ratio = 0.15  # 比例阈值：dx/dy < 0.15 视为垂直，dy/dx < 0.15 视为水平

    # 迭代对齐（3次让拐角稳定）
    for _ in range(3):
        for i in range(n):
            p1 = result[i]
            p2 = result[(i + 1) % n]
            dx = abs(p2[0] - p1[0])
            dy = abs(p2[1] - p1[1])

            if dy < 1e-6:
                dy = 1e-6
            if dx < 1e-6:
                dx = 1e-6

            # 垂直边：dx/dy < ratio（x变化很小，y变化大）
            if dx / dy < ratio and dy > 3.0:
                avg_x = round((p1[0] + p2[0]) / 2)
                result[i][0] = avg_x
                result[(i + 1) % n][0] = avg_x
            # 水平边：dy/dx < ratio（y变化很小，x变化大）
            elif dy / dx < ratio and dx > 3.0:
                avg_y = round((p1[1] + p2[1]) / 2)
                result[i][1] = avg_y
                result[(i + 1) % n][1] = avg_y

    # 拐角修正：如果两条邻边一条水平一条垂直，修正拐角点
    for i in range(n):
        p_prev = result[(i - 1) % n]
        p_curr = result[i]
        p_next = result[(i + 1) % n]

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

        # 直角拐角：水平入 + 垂直出，或垂直入 + 水平出
        if (in_horiz and out_vert) or (in_vert and out_horiz):
            if in_horiz:
                result[i][1] = round(p_prev[1])
            if in_vert:
                result[i][0] = round(p_prev[0])
            if out_horiz:
                result[i][1] = round(p_next[1])
            if out_vert:
                result[i][0] = round(p_next[0])

    # 去重（吸附后可能产生重复点）
    unique = [result[0]]
    for i in range(1, len(result)):
        if not np.allclose(result[i], unique[-1], atol=0.5):
            unique.append(result[i])

    if len(unique) > 1 and not np.allclose(unique[0], unique[-1], atol=0.5):
        unique.append(unique[0])

    return np.array(unique, dtype=int)


def bitmap_to_vector(image_path, output_svg_path,
                     threshold=128,
                     invert=False,
                     epsilon=1.0,
                     ortho_snap=2.0,
                     smooth_iter=2,
                     smooth_angle=5.0,
                     ignore_border=True):
    """
    位图精准转矢量图 V30

    参数:
        image_path: 输入图片路径
        output_svg_path: 输出SVG路径
        threshold: 二值化阈值。128为中间值，-1为Otsu自动
        invert: False=提取白色前景，True=提取黑色前景
        epsilon: approxPolyDP容差（像素）。0.5=极度精细，1.0=平衡，3.0=强压缩
        ortho_snap: 正交吸附容差（像素）。小于此值的dx/dy视为水平/垂直
        smooth_iter: 自适应平滑迭代次数（默认2，越大越平滑）
        smooth_angle: 角度阈值（度），小于此值的顶点视为锯齿点平滑（默认5.0）
        ignore_border: 是否忽略图像外边界轮廓（建议True）
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

    # 轮廓提取（保留层级关系，用于正确处理孔洞）
    contours, hierarchy = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

    if hierarchy is None or len(contours) == 0:
        print("未提取到任何轮廓")
        return 0

    hierarchy = hierarchy[0]

    # 过滤轮廓（忽略图像边界和噪点）
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
        # Step 1: approxPolyDP几何简化
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        pts = approx.reshape(-1, 2).astype(np.float32)

        if len(pts) < 3:
            continue

        # Step 2: 比例正交化（强制水平/垂直边对齐）
        pts = orthogonalize(pts, ortho_snap)

        # Step 3: 自适应平滑（消除微小锯齿，保留角点）
        pts = smooth_polygon(pts, iterations=smooth_iter, angle_threshold=smooth_angle)

        # Step 4: 生成SVG路径（全部整数坐标）
        d = 'M %d,%d' % (int(pts[0][0]), int(pts[0][1]))
        for p in pts[1:]:
            d += ' L %d,%d' % (int(p[0]), int(p[1]))
        d += ' Z'
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

    total_points = sum(len(re.findall(r'[ML]\s+[\d\.,\s]+', seg)) for seg in path_segments)
    print('转换完成: %s' % output_svg_path)
    print('  有效轮廓: %d' % len(path_segments))
    print('  总点数: %d' % total_points)
    print('  文件大小: %.1f KB' % (os.path.getsize(output_svg_path) / 1024))

    return len(path_segments)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    if len(sys.argv) < 2:
        print('用法: python bitmap_to_vector_deepseek.py <输入图片> [输出.svg] [选项]')
        print()
        print('选项:')
        print('  --invert         提取黑色前景（默认提取白色）')
        print('  --eps N          approxPolyDP容差像素（默认1.0）')
        print('  --snap N         正交吸附容差像素（默认2.0）')
        print('  --threshold N    二值化阈值（默认128，-1=Otsu自动）')
        print('  --smooth-iter N  平滑迭代次数（默认2，越大越平滑）')
        print('  --smooth-angle N 角度阈值度（默认5.0，小于此值的顶点被平滑）')
        print()
        print('场景推荐:')
        print('  极致精细:  --eps 0.5  （圆弧几乎完美，文件稍大）')
        print('  平衡模式:  --eps 1.0  （推荐，肉眼无损）')
        print('  强压缩:    --eps 3.0  （文件小，略有锯齿）')
        print('  加强平滑:  --smooth-iter 3 --smooth-angle 8.0')
        print()
        print('示例:')
        print('  python bitmap_to_vector_deepseek.py icon.png')
        print('  python bitmap_to_vector_deepseek.py icon.png icon.svg')
        print('  python bitmap_to_vector_deepseek.py icon.png --invert --eps 0.5')
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

    smooth_iter = 2
    if '--smooth-iter' in sys.argv:
        try:
            smooth_iter = int(sys.argv[sys.argv.index('--smooth-iter') + 1])
        except (IndexError, ValueError):
            pass

    smooth_angle = 5.0
    if '--smooth-angle' in sys.argv:
        try:
            smooth_angle = float(sys.argv[sys.argv.index('--smooth-angle') + 1])
        except (IndexError, ValueError):
            pass

    bitmap_to_vector(
        input_path, output_path,
        threshold=threshold,
        invert=invert,
        epsilon=eps,
        ortho_snap=snap,
        smooth_iter=smooth_iter,
        smooth_angle=smooth_angle,
        ignore_border=True
    )


if __name__ == '__main__':
    main()