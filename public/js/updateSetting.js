import axios from 'axios'
import {showAlert} from './alert'

export const updateData= async (data,type)=>{ try{
        const url="http://127.0.0.1:3000/api/v1/users/updateMe"

        const res =await axios({
            method:'patch',
            url,
            data
        
        });
        
        if (res.data.status === 'success'){
            showAlert('success','Data updated successfully')
        }

    }catch(err){
        showAlert('error',err.response.data.message)

    }
}
