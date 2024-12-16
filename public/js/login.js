import axios from 'axios'
import {showAlert} from './alert'
export const login =async (email ,password)=>{
    console.log(email, password)
    try{
        const res = await axios({
            method:"post",
            url:`${location.origin}/api/v1/users/login`,
            data:{
                email,
                password
            },
            withCredentials:true ,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-Type': 'application/json',
            }
        })

        
    // console.log(res.data.status)
        if(res.data.status === 'success'){
            showAlert('success','loged in succesfully')
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }
    }catch(err){
        showAlert('error','passwrod or email fail')

    }
}
export const logout = async ()=>{
    console.log('axios logout')
    try{
        const res =await axios({
            method:'get',
            url:`${location.origin}/api/v1/users/logout`,
        });

        if((res.data.status ='success')) location.reload(true); 
        
    }catch(err){
        showAlert('error','error loging out')
    }
}    