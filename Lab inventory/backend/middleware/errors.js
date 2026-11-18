module.exports=(err,req,res,next)=>{
  console.error(err);
  if(err.name==='ValidationError')
    return res.status(400).json({ok:false,message:'Validation error',details:Object.values(err.errors).map(e=>e.message)});
  if(err.code===11000)
    return res.status(409).json({ok:false,message:'Product code already exists'});
  if(err.name==='CastError')
    return res.status(400).json({ok:false,message:'Invalid product ID'});
  res.status(err.status||500).json({ok:false,message:err.message||'Server error'});
};
