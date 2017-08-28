const mongoose = require('mongoose');
const Uploads = require('../models/uploads.model')
var multer = require('multer')
var path = require('path')

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// var upload = multer({ storage: storage })
               
exports.filedata = function(req, res, next) {
    var id = req.params.id;
    if (id !== 'null') {
        var upload = multer({
                storage: storage,
                fileFilter: function(req, file, callback) {
                    var ext = path.extname(file.originalname)
                    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                        return callback(res.end('Only images are allowed'), null)
                    }
                    callback(null, true)
                }
            })
            .single('avatar');
        upload(req, res, function(err) {
            var uploads = new Uploads(req.file)
            uploads.cateId = id;
            uploads.save().then(data => {
                res.json(data)
            })
        })
    } else {
        res.status(400).send({ "errorCode": 101, "message": "请选择分类" });
    }
}



exports.create = function(req, res, next) {
    const uploads = new Uploads(req.body);
    uploads.save()
        .then(data => {
            res.json(data)
        })
};


exports.getData = function(req, res, next) {
    let id = req.params.id;
    Uploads.findById(id)
        .then(data => {
            res.json(data);
        })
};

exports.update = function(req, res, next) {
    const uploads = new Uploads(req.body);
    const id = req.params.id;

    Uploads.findByIdAndUpdate(id, { $set: req.body }, { new: false })
        .then((data) => {
            res.send({ data });
        })

};

exports.list = function(req, res, next) {
    var page = (req.body.page) ? req.body.page : 1;
    var limit = (req.body.limit) ? req.body.limit : 5;
    var queryCondition = {};
    if (req.body.originalname && req.body.originalname.trim()
        .length > 0) {
        originalname = req.body.originalname;
        queryCondition = {
            "originalname": new RegExp(originalname, "i")
        }
    }

    if (req.body.cateId && req.body.cateId.trim()
        .length > 0) {
        cateId = req.body.cateId;
        queryCondition = Object.assign(queryCondition, {
            "cateId": cateId
        })
    }

    console.log(queryCondition)
    Uploads.paginate(queryCondition, { page: page, limit: limit }, function(err, result) {
        res.json(result);
    });

}


exports.getall = function(req, res, next) {
    Uploads.find()
        .then(data => {
            res.json(data);
        })
};

exports.remove = function(req, res, next) {
    var id = req.params.id;
    Uploads.findByIdAndRemove(id, function(err, doc) { // 除了删除数据，还需要注意要删除文件
        res.json({ "message": "delete ok" });
    })

};

exports.removes = function(req, res, next) {
    var ids = req.body.ids;
    if (ids.length > 0) {
        Uploads.remove({ _id: { $in: ids } })
            .then(deletedData => {
                res.json({ "message": "delete ok" });
            })
    } else {
        res.status(404)
            .send({ "message": "404" });
    }

};