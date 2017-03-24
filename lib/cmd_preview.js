var express = require('express');
var path = require('path');
var utils = require('./utils');
var open = require("open");

module.exports = function (dir) {

    dir = dir || ".";

    //初始化Express
    var app = express();
    var router = express.Router();
    app.use(express.static(dir));
    app.use(router);

    //渲染文章
    router.get('/posts/*',function (req,res,next) {
        var name = utils.stripExtname(req.params[0]);
        var file = path.resolve(dir,"_posts",name+".md");
        var html = utils.renderPost(dir,file);
        res.end(html);
    });

    //渲染列表
    router.get("/",function (req,res,next) {
        var html = utils.renderIndex(dir);
        res.end(html);
    });
    var config = utils.loadConfig(dir);
    var port = config.port || 3000;
    var url = "http://127.0.0.1:"+port;
    app.listen(port,function () {
        console.log("服务器开始监听3000端口---127.0.0.1:"+port)
    })
    open(url);
    app.use(function(req, res, next) {
        res.status(404).send('Sorry cant find that! 404');
    });
    app.use(function(err, req, res, next) {
        console.error("==========================="+err.stack+"===================");
        res.status(500).send('无此页面请返回重试！');
    });
}



