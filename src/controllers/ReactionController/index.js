const reactionModel = require("../../models/reaction.model")
const { RESPONSE_STATUS } = require("../../utils/constants")

class ReactionController {

    async getReactionsByTargetID(req, res) {
        const {targetID} = req.params
        reactionModel.findOne({targetID}).then(data => {
            res.status(200).json(data)
        }).catch(error => {
            console.log('Error when get reactions by target id: ', error)
            res.status(200).json(RESPONSE_STATUS.ERROR)
        })
    }

    async getReactionOfUserByTargetID(req, res) {
        const {targetID, userID} = req.params
        reactionModel.findOne({targetID, userID}).then(data => {
            res.status(200).json(data)
        }).catch(error => {
            console.log('Error when get reaction of user by target id: ', error)
            res.status(500).json(RESPONSE_STATUS.ERROR)
        })
    }

    async updateReactionOfUserByTargetID(req, res) {
        const {targetID, userID, userName, avatar, status} = req.body
        console.log('into update reaction: ', req.body)
        reactionModel.findOne({targetID, userID}).then(data => {
            if(data) {
                const status = data.status;
                console.log('status in update reaction: ', status)
                data.updateOne({status: !status}, {returnDocument:'after'}).then(data => res.status(200).json({...data, status: !status}))
            } else 
            {
                console.log('not having: create')
                reactionModel.create({
                    targetID,
                    userID,
                    userName,
                    avatar,
                    status: true
                }).then(data => {
                    res.status(200).json(data)
                })
            }
        }).catch(error => {
            console.log('Error when update reaction of user by target id: ', error)
            res.status(200).json(RESPONSE_STATUS.ERROR)
        })
    }

}

module.exports = new ReactionController()