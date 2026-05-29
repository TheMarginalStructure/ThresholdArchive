/**
 * 字体管理模块 - 统一管理项目中的所有字体
 */

/** 等宽字体 - 用于档案编号、时间戳、代码等英文/数字场景 */
export const MONO = '"JetBrains Mono", "Geist Mono", "Space Mono", monospace'

/** 正文字体 - 用于标题、正文等中英文混合场景 */
export const BODY = '"JetBrains Mono", "Noto Sans SC", sans-serif'

/** 字体工具函数 - 生成 style 对象 */
export const fontStyle = (type: 'mono' | 'body') => ({
  fontFamily: type === 'mono' ? MONO : BODY,
})
