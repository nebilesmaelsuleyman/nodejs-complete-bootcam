import axios from 'axios'
import {showAlert} from './alert'

export const updateData= async (name, email)=>{
    try{

        const res =await axios({
            method:'patch',
            url:`${location.origin}/api/v1/users/updateMe`,
            data:{
                name,
                email
            }
        });
        
        if (res.data.status === 'success'){
            showAlert('success','Data updated successfully')
        }

    }catch(err){
        showAlert('errror',err.response.data.message)

    }
}
