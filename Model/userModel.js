const { schema } = require('eslint-plugin-node/lib/util/get-try-extensions')
const mongoose=require('mongoose')
const validator= require('validator');
const bcrypt=require('bcryptjs')
const crypto =require('crypto')

 // built in module


const userSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            unique:true,
            index:true,
            requiere:true
        },
        email:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            validation:[validator.isEmail, 'please provide a valid email ']
        },
        photo:{
            type:String,
            default:'default.jpg'
        },
        role :{
            type:String,
            enum:['admin', 'user', 'lead-guide','guide'],
            default:'user'
        
        },

        password:{
            type:String,
            requiere:true,
            minlength:8,
        
        },
        passwordconfirmation:{
            type:String,
            require:[true , 'please confirm your password'],
            validate:{
                validator:function(el){
                    return el === this.password;
                },
                message:'passwords are not the same'
            }
        },
        passwordChangedAt:{
            type:Date 
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active:{
            type:Boolean,
            default:true,
            select:false     
        }
    });

    userSchema.pre('save', async function(next){
    // if the password field hasnt been modified , just call the next midlleware
    if(!this.isModified('password'))return  next();
    
    // hash the password
    this.password = await bcrypt.hash(this.password, 12)
    // set the passwordconfirmation field to undefined
    this.passwordconfirmation =undefined;
    next()
});
userSchema.pre('/^find/',function(next){
    this.find({active:{$ne:false }})
})


//  comparing the password during login
    userSchema.methods.comparePassword = async function(candidatePassword){
    console.log('candidate password', candidatePassword)
    
    // const candidatepasswordtostring =candidatePassword.toString()
    // console.log(candidatepasswordtostring)
    const candidatepasswordtostring =candidatePassword.password;
    console.log(candidatepasswordtostring);
    console.log('stored password:', this.password)
    return await bcrypt.compare(candidatepasswordtostring , this.password)
}

    userSchema.methods.changedaPasswordAfter= function(JWTTimestamp) {
    if (this.passwordChangedAt){
        const changedTimestamp =parseInt(this.passwordChangedAt.getTime()/1000,10)
    console.log(changedTimestamp, JWTTimestamp)
    return JWTTimestamp < changedTimestamp ;
}
    return false
}

// userSchema.methods.correctPassword= async function(
//     candidatePassword,
//     userPassword
//   ) {
//     return await bcrypt.compare(candidatePassword, userPassword);
//   };
userSchema.methods.correctpasswords=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}



userSchema.methods.createPasswordResetToken = async function() {
    const resetToken =   crypto.randomBytes(32).toString('hex');

    this.passwordResetToken= crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    // console.log({ resetToken },"this is the resetpasswordtoken in the model",
    // this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    // console.log('end of createresettoken')
    return resetToken;
};

// userSchema.pre('save',function(next){
//     if(this.isModified('password')|| this.isNew )return next();  
//     this.passwordChangedAt = Date.now() -10000;
// })
var user = mongoose.model('user',userSchema)
    module.exports=user;