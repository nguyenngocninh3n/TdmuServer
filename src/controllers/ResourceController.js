const { readdir } = require('fs')
const path = require('path')

class ResourceController {

    getConventionFiles(req, res) {
        console.log('inner get convention files')
        const conventionID = req.params.id
        const fileType = req.query.fileType
        const path = require('path')
        const responsePath = `uploads/conventions/${conventionID}/${fileType}/`
        const folderPath = path.join(__dirname, '../public/' + responsePath)
        readdir(folderPath, (err, files) => {
            if(err) {
                console.log('Lỗi khi đọc file trong getconventionfiles: ', err)
                res.status(200).json([])
                return;
            }
            const newArr = files.map(item => responsePath + item )
            res.status(200).json(newArr)
        })

    }
}

module.exports = new ResourceController()