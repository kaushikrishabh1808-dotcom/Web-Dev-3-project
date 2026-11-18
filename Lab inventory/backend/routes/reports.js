const express=require('express');
const Item=require('../models/InventoryItem');
const router=express.Router();

router.get('/low-stock',async(req,res,next)=>{
  try{
    const items=await Item.aggregate([
      {$match:{$expr:{$lte:['$stock','$reorderLevel']}}},
      {$project:{_id:1,productName:1,code:1,category:1,price:1,stock:1,reorderLevel:1}},
      {$sort:{stock:1}}
    ]);
    res.json({ok:true,count:items.length,items});
  }catch(e){next(e);}
});

router.get('/category-summary',async(req,res,next)=>{
  try{
    const summary=await Item.aggregate([
      {$group:{
        _id:'$category',
        products:{$sum:1},
        units:{$sum:'$stock'},
        inventoryValue:{$sum:{$multiply:['$price','$stock']}},
        averagePrice:{$avg:'$price'}
      }},
      {$project:{
        _id:0,category:'$_id',products:1,units:1,
        inventoryValue:{$round:['$inventoryValue',2]},
        averagePrice:{$round:['$averagePrice',2]}
      }},
      {$sort:{inventoryValue:-1}}
    ]);
    res.json({ok:true,summary});
  }catch(e){next(e);}
});

module.exports=router;
