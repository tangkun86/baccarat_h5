var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.listen(8080, function() {
	console.log('服务启动成功');
});

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/baccarat')
		.then(function(db) {
			console.log('连接数据库成功');
		});
var userModel = require('./model/user');
var user = new userModel({
	username: 'ly',
	password: '123'
});
user.save(function(err, doc) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('保存成功');
});