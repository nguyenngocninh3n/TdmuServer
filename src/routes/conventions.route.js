

const express = require('express')
const ConventionController = require('../controllers/ConventionController')
const router = express.Router()

router.get('/conventionID', ConventionController.getConventionID)
router.post('/:conventionID/message/:messageID', ConventionController.updateMessage )
router.get('/conventionIDs', ConventionController.getConventionIDs)
router.get('/owner/:id', ConventionController.getConventions)
router.get('/:id', ConventionController.getConventionByID)
router.post('/store', ConventionController.storeConvention)
router.post('/:id', ConventionController.storeMessage)

module.exports = router
