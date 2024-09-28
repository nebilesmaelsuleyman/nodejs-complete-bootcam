/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
const fs =require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const tour= require("./../../Model/tourModel")

dotenv.config({ path: './config.env' });


// DATABASE="mongodb+srv://nebilesmael10:ED3P_2meSu4Aef/@cluster0.ramuxrb.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect('mongodb+srv://new_user:nebiloos@cluster0.ramuxrb.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
  console.log("mongoose is connected succesfully!!!")
})

// READ JSON FILE
const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
  

  // IMPORT DATA INTO DB
  const importData= async ()=>{
    try{
      await tour.create(tours)
      console.log('data successfully loaded');


    }catch(err){
    console.log(err);
    }
  }
  // DELETE ALL DATA FROM DB

const deleteData =async ()=>{
  try{
    await tour.deleteMany();
    console.log('data is succesfully deleted');

  }catch(err){
    console.log(err);

  }
}

if(process.argv[2] === '--import'){
  importData()
}else if(process.argv[2]=== '--delete'){
  deleteData()
  console.log('data is deleted succesfully')
}


console.log(process.argv)