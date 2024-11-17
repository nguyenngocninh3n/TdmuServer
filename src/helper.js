const fs = require('fs')
const { POST_ATTACHMENT, FILE_EXT, FOLDER_NAME } = require('./utils/constants')
const path = require('path')

const storeFile = (dirPath, filePath, fileData) => {
  fs.mkdir(dirPath, { recursive: true }, err => {
    if (err) {
      console.error('Lỗi khi tạo thư mục:', err.message)
      return
    }

    fs.writeFileSync(filePath, fileData, err => {
      if (err) {
        console.error('Lỗi khi lưu file:', err.message)
      } else {
        console.log('File đã được lưu thành công tại:', filePath)
      }
    })
  })
}

const storeMultiFile = async (staticFilePaths, dirPath, filesData) => {

  fs.mkdir(dirPath + FOLDER_NAME.IMAGE, { recursive: true }, err => {
    if (err) {
      console.error('Lỗi khi tạo thư mục:', err.message)
      return
    }
    fs.mkdir(dirPath + FOLDER_NAME.VIDEO, { recursive: true }, err => {
        if (err) {
          console.error('Lỗi khi tạo thư mục:', err.message)
          return
        }
        filesData.forEach((item, index) =>
            fs.writeFile(staticFilePaths.at(index), item.source, err => {
              if (err) {
                console.error('Lỗi khi lưu file:', err.message)
              } else {
                console.log('File đã được lưu thành công tại:', staticFilePaths.at(index))
              }
            })
          )
      })
  })
}

//path don't include folder_type: /video/file_name.ext
const getUploadFolderPath = (__dirname, folderType, folderID) => {
  const relativePath = `uploads/${folderType}/${folderID}/`
  const dirPath = path.join(__dirname, '../../public/' + relativePath)
  return [relativePath, dirPath]
}

const getUploadFileAndFolderPath = (__dirname, folderType, folderID, attachments) => {
  const relativePath = `uploads/${folderType}/${folderID}/`
  const dirPath = path.join(__dirname, '../../public/' + relativePath)
  const staticFilePaths = []
  const relativeFilePaths = attachments.map(item => {
    const fileExt = item.type === POST_ATTACHMENT.IMAGE ? FILE_EXT.IMAGE : FILE_EXT.VIDEO
    const fileName = Math.random().toFixed(10) + fileExt
    const fileType = fileExt === FILE_EXT.IMAGE ? FOLDER_NAME.IMAGE : FOLDER_NAME.VIDEO
    staticFilePaths.push(dirPath +  fileType +'/' + fileName )
    return {
      type: fileType.toUpperCase(),
      source: relativePath + fileType +'/' + fileName
    }
  })
  return [relativeFilePaths, staticFilePaths, dirPath]
}

const helper = {
  storeFile,
  storeMultiFile,
  getUploadFolderPath,
  getUploadFileAndFolderPath
}
module.exports = helper
