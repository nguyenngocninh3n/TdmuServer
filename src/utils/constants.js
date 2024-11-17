var os = require('os')
const network = os.networkInterfaces()
const Wifi = network['Wi-Fi'].filter(item => item.family === 'IPv4')[0]
const HOST = Wifi.address
// const HOST = '192.168.1.9'
const PORT = 8080

const MESSAGE_TYPE = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  NOTIFY: 'NOTIFY'
}

const MESSAGE_NOTIFY_TYPE = {
  CHANGE_AVATAR: 'CHANGE_AVATAR',
  CHANGE_AKA: 'CHANGE_AKA',
  CHANGE_CONVENTION_NAME: 'CHANGE_CONVENTION_NAME'
}

const MESSAGE_ACTION = {
  EDIT: 'EDIT',
  REMOVE: 'REMOVE',
  DELETE: 'DELETE'
}

const RESPONSE_STATUS = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
}

const FRIEND_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  ACCEPTING: 'ACCEPTING',
  REFUSING: 'REFUSING',
  FRIEND: 'FRIEND'
}

const SCOPE = {
  PUBLIC: 'PUBLIC',
  FRIEND: 'FRIEND',
  PRIVATE: 'PRIVATE'
}

const POST_ATTACHMENT = {
  TEXT: 'TEXT',
  IMAGE: 'image/jpeg',
  VIDEO: 'video/mp4',
  NOTIFY: 'NOTIFY',
  MIX: 'MIX'
}

const FOLDER_NAME = {
  CONVENTIONS: 'conventions',
  POSTS: 'posts',
  USERS: 'users',
  IMAGE: 'image',
  VIDEO: 'video'
}


const FILE_EXT = {
  IMAGE: '.png',
  VIDEO: '.mp4'
}

const MEMBER_ROLE = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
}

module.exports = {
  HOST,
  PORT,
  POST_ATTACHMENT,
  FOLDER_NAME,
  SCOPE,
  FILE_EXT,
  MESSAGE_TYPE,
  FRIEND_STATUS,
  RESPONSE_STATUS,
  MESSAGE_NOTIFY_TYPE,
  MESSAGE_ACTION,
  MEMBER_ROLE
}
