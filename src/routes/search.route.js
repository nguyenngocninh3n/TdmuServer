const express = require('express')
const SearchController = require('../controllers/SearchController')
const router = express.Router()

router.get('/post/:userID/:queryString', SearchController.getSearchPost)
router.get('/user/:userID/:queryString', SearchController.getSearchUser)
router.get('/group/:userID/:queryString', SearchController.getSearchGroup)
router.get('/image/:userID/:queryString', SearchController.getSearchImage)
router.get('/video/:userID/:queryString', SearchController.getSearchVideo)

module.exports = router