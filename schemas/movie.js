var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var MovieSchema = new mongoose.Schema(
{
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	poster:String,
	flash:String,
	year:Number,
	meta:
	{
		createAt:
		{
			type:Date,
			default:Date.now()
		},
		updateAt:
		{
			type:Date,
			default:Date.now()
		}
	}
})

MovieSchema.pre('save',function(next)
{
	if (this.isNew)
	{
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else
	{
		this.meta.updateAt = Date.now();
	}
	next();
})
MovieSchema.statics = 
{
	fetch: function(cb)
	{
		console.log('do fetch');
		//var allMovies = this.find({}).sort('meta.updateAt');
		//console.log(allMovies);
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById: function(id,cb)
	{
		return this.findOne({_id:ObjectID(id)})
		.exec(cb)
	}
}
module.exports = MovieSchema;