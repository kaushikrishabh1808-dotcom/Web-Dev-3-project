const express=require('express');
const Item=require('../models/InventoryItem');
const router=express.Router();

router.post('/',async(req,res,next)=>{
  try{res.status(201).json({ok:true,item:await Item.create(req.body)});}
  catch(e){next(e);}
});

router.get('/',async(req,res,next)=>{
  try{
    const {search,category,minPrice,maxPrice,sort='createdAt',direction='desc',page=1,size=10}=req.query;
    const p=Math.max(1,Number(page)), s=Math.min(100,Math.max(1,Number(size)));
    const q={};
    if(category) q.category=category;
    if(search) q.$or=[
      {productName:{$regex:search,$options:'i'}},
      {code:{$regex:search,$options:'i'}},
      {description:{$regex:search,$options:'i'}}
    ];
    if(minPrice!==undefined||maxPrice!==undefined){
      q.price={};
      if(minPrice!==undefined) q.price.$gte=Number(minPrice);
      if(maxPrice!==undefined) q.price.$lte=Number(maxPrice);
    }
    const allowed=['productName','code','category','price','stock','createdAt'];
    if(!allowed.includes(sort)){const e=new Error('Invalid sort field');e.status=400;throw e;}
    const [items,total]=await Promise.all([
      Item.find(q).sort({[sort]:direction==='asc'?1:-1}).skip((p-1)*s).limit(s),
      Item.countDocuments(q)
    ]);
    res.json({ok:true,items,pagination:{total,page:p,size:s,totalPages:Math.ceil(total/s)}});
  }catch(e){next(e);}
});

router.get('/:id',async(req,res,next)=>{
  try{
    const item=await Item.findById(req.params.id);
    if(!item){const e=new Error('Inventory item not found');e.status=404;throw e;}
    res.json({ok:true,item});
  }catch(e){next(e);}
});

router.put('/:id',async(req,res,next)=>{
  try{
    const item=await Item.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!item){const e=new Error('Inventory item not found');e.status=404;throw e;}
    res.json({ok:true,item});
  }catch(e){next(e);}
});

router.patch('/:id/stock',async(req,res,next)=>{
  try{
    const {action,amount}=req.body, qty=Number(amount);
    if(!['add','remove'].includes(action)){const e=new Error('action must be add or remove');e.status=400;throw e;}
    if(!Number.isInteger(qty)||qty<=0){const e=new Error('amount must be a positive integer');e.status=400;throw e;}
    const filter=action==='remove'?{_id:req.params.id,stock:{$gte:qty}}:{_id:req.params.id};
    const item=await Item.findOneAndUpdate(filter,{$inc:{stock:action==='add'?qty:-qty}},{new:true,runValidators:true});
    if(!item){
      const exists=await Item.exists({_id:req.params.id});
      const e=new Error(exists?'Not enough stock':'Inventory item not found');e.status=exists?400:404;throw e;
    }
    res.json({ok:true,message:action==='add'?'Stock increased':'Stock decreased',item});
  }catch(e){next(e);}
});

router.delete('/:id',async(req,res,next)=>{
  try{
    const item=await Item.findByIdAndDelete(req.params.id);
    if(!item){const e=new Error('Inventory item not found');e.status=404;throw e;}
    res.json({ok:true,message:'Item deleted',item});
  }catch(e){next(e);}
});

module.exports=router;
