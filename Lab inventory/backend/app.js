require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const inventory=require('./routes/inventory');
const reports=require('./routes/reports');
const errors=require('./middleware/errors');
const notFound=require('./middleware/notFound');

const app=express();
const PORT=process.env.PORT||3000;

app.use(express.json());

app.get('/',(req,res)=>res.json({
  ok:true,
  project:'Inventory Management System - Lab 3',
  endpoints:[
    'POST /api/inventory','GET /api/inventory','GET /api/inventory/:id',
    'PUT /api/inventory/:id','PATCH /api/inventory/:id/stock',
    'DELETE /api/inventory/:id','GET /api/reports/low-stock',
    'GET /api/reports/category-summary'
  ]
}));

app.get('/api/health',(req,res)=>res.json({
  ok:true,
  mongodb:mongoose.connection.readyState===1?'connected':'disconnected'
}));

app.use('/api/inventory',inventory);
app.use('/api/reports',reports);
app.use(notFound);
app.use(errors);

(async()=>{
  try{
    if(!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from .env');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT,()=>console.log(`Inventory API running at http://localhost:${PORT}`));
  }catch(e){
    console.error('Could not start:',e.message);
    process.exit(1);
  }
})();
