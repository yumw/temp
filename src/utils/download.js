// 下载文件
export function downloadFile(data, fileName) {
  if (!data) {
    return
  }
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(link.href)
}
//预览图片
export function previewFile(data, fileName){
  if (!data) {
    return
  }
  let blob = new Blob([data])
  let url = window.URL.createObjectURL(blob)
  return url;
}