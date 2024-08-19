/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// DATABASE="mongodb+srv://nebilesmael10:ED3P_2meSu4Aef/@cluster0.ramuxrb.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect('mongodb+srv://new_user:nebiloos@cluster0.ramuxrb.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
  console.log("mongoose is connected succesfully!!!")
})
 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
