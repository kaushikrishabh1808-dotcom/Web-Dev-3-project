const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  productName:{type:String,required:true,trim:true,minlength:2,maxlength:100},
  code:{type:String,required:true,unique:true,trim:true,uppercase:true,match:/^[A-Z0-9-]+$/},
  category:{type:String,required:true,enum:['Beds','Sofas','Chairs','Tables','Wardrobes','Other']},
  price:{type:Number,required:true,min:0},
  stock:{type:Number,required:true,min:0,validate:{validator:Number.isInteger,message:'Stock must be an integer'}},
  reorderLevel:{type:Number,default:5,min:0,validate:{validator:Number.isInteger,message:'Reorder level must be an integer'}},
  description:{type:String,trim:true,maxlength:500}
},{timestamps:true});

schema.index({category:1});
schema.index({stock:1});
schema.index({price:1});

module.exports=mongoose.model('InventoryItem',schema);
