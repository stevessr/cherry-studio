import i18n from '@renderer/i18n'
import imageCompression from 'browser-image-compression'
import * as htmlToImage from 'html-to-image'

/**
 * 将文件转换为 Base64 编码的字符串或 ArrayBuffer。
 * @param {File} file 要转换的文件
 * @returns {Promise<string | ArrayBuffer | null>} 转换后的 Base64 编码数据，如果出错则返回 null
 */
export const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 验证 URL 是否是有效的图片 URL
 * @param {string} url 要验证的 URL
 * @returns {boolean} 是否是有效的图片 URL
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    // 检查协议是否为 http 或 https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false
    }
    // 检查是否包含常见的图片扩展名
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i
    return imageExtensions.test(urlObj.pathname) || urlObj.pathname === '/'
  } catch {
    return false
  }
}

/**
 * 从 URL 下载图片并转换为 base64
 * @param {string} url 图片 URL
 * @returns {Promise<string>} base64 编码的图片数据
 */
export const downloadImageFromUrl = async (url: string): Promise<string> => {
  try {
    if (!isValidImageUrl(url)) {
      throw new Error('Invalid image URL')
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(30000) // 30秒超时
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('URL does not point to an image')
    }

    const blob = await response.blob()

    // 将 blob 转换为 base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('Failed to convert image to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error downloading image from URL:', error)
    throw error
  }
}

/**
 * 压缩图像文件，限制最大大小和尺寸。
 * @param {File} file 要压缩的图像文件
 * @returns {Promise<File>} 压缩后的图像文件
 */
export const compressImage = async (file: File): Promise<File> => {
  return await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 300,
    useWebWorker: false
  })
}

/**
 * 捕获指定 div 元素的图像数据。
 * @param divRef div 元素的引用
 * @returns Promise<string | undefined> 图像数据 URL，如果失败则返回 undefined
 */
export async function captureDiv(divRef: React.RefObject<HTMLDivElement>) {
  if (divRef.current) {
    try {
      const canvas = await htmlToImage.toCanvas(divRef.current)
      const imageData = canvas.toDataURL('image/png')
      return imageData
    } catch (error) {
      console.error('Error capturing div:', error)
      return Promise.reject()
    }
  }
  return Promise.resolve(undefined)
}

/**
 * 捕获可滚动 div 元素的完整内容图像。
 * @param divRef 可滚动 div 元素的引用
 * @returns Promise<HTMLCanvasElement | undefined> 捕获的画布对象，如果失败则返回 undefined
 */
export const captureScrollableDiv = async (divRef: React.RefObject<HTMLDivElement | null>) => {
  if (divRef.current) {
    try {
      const div = divRef.current

      // Save original styles
      const originalStyle = {
        height: div.style.height,
        maxHeight: div.style.maxHeight,
        overflow: div.style.overflow,
        position: div.style.position
      }

      const originalScrollTop = div.scrollTop

      // Modify styles to show full content
      div.style.height = 'auto'
      div.style.maxHeight = 'none'
      div.style.overflow = 'visible'
      div.style.position = 'static'

      // calculate the size of the div
      const totalWidth = div.scrollWidth
      const totalHeight = div.scrollHeight

      // check if the size of the div is too large
      const MAX_ALLOWED_DIMENSION = 32767 // the maximum allowed pixel size
      if (totalHeight > MAX_ALLOWED_DIMENSION || totalWidth > MAX_ALLOWED_DIMENSION) {
        // restore the original styles
        div.style.height = originalStyle.height
        div.style.maxHeight = originalStyle.maxHeight
        div.style.overflow = originalStyle.overflow
        div.style.position = originalStyle.position

        // restore the original scroll position
        setTimeout(() => {
          div.scrollTop = originalScrollTop
        }, 0)

        window.message.error({
          content: i18n.t('message.error.dimension_too_large'),
          key: 'export-error'
        })
        return Promise.reject()
      }

      const canvas = await new Promise<HTMLCanvasElement>((resolve, reject) => {
        htmlToImage
          .toCanvas(div, {
            backgroundColor: getComputedStyle(div).getPropertyValue('--color-background'),
            cacheBust: true,
            pixelRatio: window.devicePixelRatio,
            skipAutoScale: true,
            canvasWidth: div.scrollWidth,
            canvasHeight: div.scrollHeight,
            style: {
              backgroundColor: getComputedStyle(div).backgroundColor,
              color: getComputedStyle(div).color
            }
          })
          .then((canvas) => resolve(canvas))
          .catch((error) => reject(error))
      })

      // Restore original styles
      div.style.height = originalStyle.height
      div.style.maxHeight = originalStyle.maxHeight
      div.style.overflow = originalStyle.overflow
      div.style.position = originalStyle.position

      const imageData = canvas

      // Restore original scroll position
      setTimeout(() => {
        div.scrollTop = originalScrollTop
      }, 0)

      return imageData
    } catch (error) {
      console.error('Error capturing scrollable div:', error)
      throw error
    }
  }

  return Promise.resolve(undefined)
}

/**
 * 将可滚动 div 元素的图像数据转换为 Data URL 格式。
 * @param divRef 可滚动 div 元素的引用
 * @returns Promise<string | undefined> 图像数据 URL，如果失败则返回 undefined
 */
export const captureScrollableDivAsDataURL = async (divRef: React.RefObject<HTMLDivElement | null>) => {
  return captureScrollableDiv(divRef).then((canvas) => {
    if (canvas) {
      return canvas.toDataURL('image/png')
    }
    return Promise.resolve(undefined)
  })
}

/**
 * 将可滚动 div 元素的图像数据转换为 Blob 格式。
 * @param divRef 可滚动 div 元素的引用
 * @param func Blob 回调函数
 * @returns Promise<void> 处理结果
 */
export const captureScrollableDivAsBlob = async (
  divRef: React.RefObject<HTMLDivElement | null>,
  func: BlobCallback
) => {
  await captureScrollableDiv(divRef).then((canvas) => {
    canvas?.toBlob(func, 'image/png')
  })
}
