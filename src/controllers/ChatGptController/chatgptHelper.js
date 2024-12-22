const chatgptModel = require('../../models/chatgpt.model')
const { RESPONSE_STATUS } = require('../../utils/constants')
const OpenAI = require('openai')
const apiKey =
  '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'

const handleRunChatGptAPI = async question => {
  const openai = new OpenAI({ apiKey })

  const completion = await openai.chat.completions
    .create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: question }]
    })
    .then(result => result.choices[0].message.content)
    return completion
}

const getChatGPTByUserID = async userID => {
  const result =  await chatgptModel
    .find({ userID })
    .then(response => {
      console.log('getChatGPT By UserID successfully')
      return { status: RESPONSE_STATUS.SUCCESS, data: response }
    })
    .catch(error => {
      console.log('Error when get ChatGPTByUserID: ', error)
      return { status: RESPONSE_STATUS.ERROR, data: [] }
    })
    return result
}

const postNewChat = async (userID, question) => {
  const answer = await handleRunChatGptAPI(question)
  chatgptModel.create({userID, question, answer})
  return {status: RESPONSE_STATUS.SUCCESS, data: {answer}}
}

const chatgptHelper = {
  getChatGPTByUserID,
  postNewChat
}

module.exports = chatgptHelper
