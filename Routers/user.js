/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
const express=require('express')
const usercontroller=require("./../controllers/usercontroller")
const Router=express.Router()
const authController=require('./../controllers/authController')




    Router.patch('/updateMe',authController.protected,usercontroller.updateMe)
    // Router.delete('/deleteMe',authController.protected,usercontroller.deleteMe)
    Router.delete('/deleteMe',authController.protected,usercontroller.deleteMe);
    Router.post('/signup',authController.signup)
    Router.post('/login',authController.login)
    Router.post('/forgotPassword', authController.forgotPassword)
    Router.patch('/resetPassword/:token',authController.resetPassword)

//the below middleware allow for the  bellow to use protected route means only loged in user can acces it 
Router.use(authController.protected)


    Router.patch('/updateMypassword',authController.updatePassword);
    Router.patch( '/updateMyPassword',authController.updatePassword);
    Router.get('/me', usercontroller.getMe, usercontroller.getuser);
Router.route('/')
    .get(usercontroller.getAllusers )
    .post(usercontroller.createuser)
Router.route('/:id')
    .get(usercontroller.getuser)
    .patch(usercontroller.updateuser)
    .delete(usercontroller.deleteuser)  


module.exports=Router;
