const admin = require('firebase-admin');

const sendNotification = async (fcmToken, title, content, data) => {
    const message = {
      token: fcmToken,
      data:data
    };
  
    try {
      const response = await admin.messaging().send(message);
      console.log('Thông báo đã được gửi:', response);
    } catch (error) {
      console.error('Lỗi khi gửi thông báo:', error);
    }
  };
  
 
  const fcmNotify = {
   sendNotification
  }

module.exports =  fcmNotify