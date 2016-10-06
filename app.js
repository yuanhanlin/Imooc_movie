var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _=require('underscore');
var Movie = require('./models/movie');
var bodyParse = require('body-parser');
var port = process.env.PORT||3000;
var app = express();
mongoose.Promise = require('bluebird');
var db = mongoose.connect('mongodb://localhost/imooc');

db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParse.json({limit:'1mb'}));
app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.listen(port);

console.log('imooc started on port '+ port);
// index page
app.get('/',function(req,res)
{
	console.log('render index');
	Movie.fetch(function(err,movies)
	{
		if (err)
		{
			console.log(err);
		}
		console.log('fetch done,and rending');
		res.render('index',
		{
			title:'imooc首页',
			movies:movies
		})
	})
		/*{
	        title: '机械战警',
	        _id: 2,
	        poster: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2169810104,2902073191&fm=58'
		},
		{
			title: '机械战警',
	        _id: 3,
	        poster: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2169810104,2902073191&fm=58'
		},
		{
			title: '机械战警',
	        _id: 4,
	        poster: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2169810104,2902073191&fm=58'
		},
		{
			title: '机械战警',
	        _id: 5,
	        poster: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2169810104,2902073191&fm=58'
		},
		{
			title: '机械战警',
	        _id: 6,
	        poster: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2169810104,2902073191&fm=58'
		}*/
})
app.get('/movie/:id',function(req,res)
{
	var id = req.params.id;
	Movie.findById(id,function(err,movie)
	{
		res.render('detail',
		{
			title:'Imooc' + movie.title,
			movie:movie,
		})
	});
	/*res.render('detail',
	{
		title:'imooc 详情页',
		movie:
		{
			doctor:'何塞·帕迪利亚',
			country: '美国',
			title:'机械战警',
			year:2014,
			poster:'http://r3.yking.com/05160000530EEB63675839160D0B79D5',
			language:'English',
			flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'翻拍自1987年同名科幻经典、由《精英部队》导演何塞·帕迪利亚执导的新版《机械战警》。'
		}
	})*/
})
//admin update movie
app.get('/admin/update/:id',function(req,res)
{
	var id = req.params.id;
	if (id)
	{
		Movie.findById(id,function(err,movie)
		{
			res.render('admin',
			{
				title:'imooc 后台更新',
				movie:movie,
			})
		})
	}
})
// admin post movie
app.post('/admin/movie/new',function(req,res)
{
	var id = req.body.movie._id;
	console.log(id);
	var movieObj = req.body.movie;
	console.log(movieObj);
	var _movie;
	if (id!=='undefined')
	{
		Movie.findById(id,function(err,movie)
		{
			if (err)
			{
				console.error(err);
			}
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie)
			{
				if (err)
				{
					console.log(err);
				}
				res.redirect('/movie/'+movie._id);
			})
		})
	} else
	{
		_movie = new Movie(
		{
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash,
		})
		_movie.save(function(err,movie)
		{
			if (err)
			{
				console.log(err);
			}

			res.redirect('/movie/'+movie._id);
		})
	}
})

app.get('/admin/movie',function(req,res)
{
	res.render('admin',
	{
		title:'imooc 后台录入页',
		movie:
		{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''

		}
	})
})
app.get('/admin/list',function(req,res)
{
	Movie.fetch(function(err,movies)
	{
		if (err)
		{
			console.log(err);
		}
		res.render('list',
		{
			title:'Imooc 列表',
			movies:movies,
		})
	})
	/*res.render('list',
	{
		title:'imooc 列表页',
		movies:[
		{
			_id:01,
			doctor:'何塞·帕迪利亚',
			country: '美国',
			title:'机械战警',
			year:2014,
			poster:'http://r3.yking.com/05160000530EEB63675839160D0B79D5',
			language:'English',
			flash:'http://player.youku.com/payer.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'翻拍自1987年同名科幻经典、由《精英部队》导演何塞·帕迪利亚执导的新版《机械战警》。'
		},
		{
			_id:02,
			doctor:'何塞·帕迪利亚',
			country: '美国',
			title:'机械战警',
			year:2014,
			//poster:'http://r3.yking.com/05160000530EEB63675839160D0B79D5',
			language:'English',
			flash:'http://player.youku.com/payer.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'翻拍自1987年同名科幻经典、由《精英部队》导演何塞·帕迪利亚执导的新版《机械战警》。'
		}]
	})*/
})
/*delete movie*/
app.delete('/admin/list',function(req,res)
{
	var id = req.query.id;
	if (id)
	{
		Movie.remove({_id:id},function(err,movie)
		{
			if (err)
			{
				console.error(err);
			} else
			{
				res.json({success:1});
			}
		})
	}
	
})