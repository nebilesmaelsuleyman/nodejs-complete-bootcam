
const login =async (email ,password)=>{
    console.log(email, password)
    try{
        const res = await axios({
            method:"post",
            url:'http://127.0.0.1:3000/api/v1/users/login',
            data:{
                email,
                password
            },
            withCredentials:true ,
            headers: {
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json'
            }
        })
        console.log( res.data);
        if (res.data.token) {
            const token = res.data.token;
            document.cookie = `jwt=${token}; path=/; expires=${new Date(Date.now() + 3600000).toUTCString()}; SameSite=Strict`; // Store token in cookie
        } else {
            console.error('Token not found in response data');
        }

    }catch(err){
        console.log(err.response.data)

    }
}


document.querySelector('.form').addEventListener('submit',e=>{
    e.preventDefault(); 
    const email =document.getElementById('email').value;
    const password= document.getElementById('password').value;
    login(email,password )
})