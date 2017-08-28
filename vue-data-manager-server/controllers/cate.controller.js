const mongoose = require('mongoose');
const Cate = require('../models/cate.model')


exports.create = function(req, res, next) {
    const cate = new Cate(req.body);
    console.log(cate);
    cate.save()
        .then(data => {
            res.json(data)
        })
};

exports.update = function(req, res, next) {
    const cate = new Cate(req.body);
    const id = req.params.id;

    Cate.findByIdAndUpdate(id, { $set: req.body }, { new: false })
        .then((data) => {
            res.send({ data });
        })
};

function reverseTree(data, pid) {
    var result = [],
        temp;

    var data = JSON.parse(JSON.stringify(data)); // 需要将对象转换才能够进行children子节点的设置，这是因为mongoose的document的返回类型问题
    for (var i in data) {
        if (data[i].parentId == pid) { // null
            result.push(data[i]);

            temp = reverseTree(data, data[i]._id); // 递归，并且把递归返回的内容设置成temp的值
            if (temp.length > 0) {
                data[i].children = temp;
            }
        }
    }
    return result;
}

exports.getall = function(req, res, next) {
    var type = req.params.type; // type是类型，1是日志，2是上传，3是相册
    Cate.find({ type: type }, function(err, data) {
        // 这里这个data它是 mongoose 的 model 数据对象，这个 mongoose 数据对象和 js的 Object是不一样的
        var rpTree = reverseTree(data, null);
        res.json(rpTree);
    });

};

exports.remove = function(req, res, next) {
    var id = req.params.id;
    var ids = [];
    Cate.findOne({ _id: id }, function(err, doc) {
        if (doc) {
            ids = [doc._id];
            doc.getChildren().then(function(docs) {
                for (var i = 0; i < docs.length; i++) {
                    ids.push(docs[i]._id);
                }

                Cate.remove({ _id: { $in: ids } })
                    .then(deleted => {
                        res.json({ "message": "delete ok" });
                    })
            });

        }

    })
};