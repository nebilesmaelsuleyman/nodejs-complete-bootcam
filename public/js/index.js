console.log('hellow parcecel')
import '@babel/polyfill';
import {login, logout} from './login'
import {updateData} from './updateSetting'
const loginForm=document.querySelector('.form--login');
const logoutbtn=document.querySelector('.nav__el--logout')
const userDataForm =document.querySelector('.form-user-data')

if(loginForm){
    loginForm.addEventListener('submit',e=>{
    e.preventDefault(); 
    const email =document.getElementById('email').value;
    const password= document.getElementById('password').value;
    login(email,password )
})}


if(logoutbtn) logoutbtn.addEventListener('click',logout)

if(userDataForm){
    userDataForm.addEventListener('submit', e=>{
        e.preventDefault();
        const form=new FormData();
        form.append('name',document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])
        console.log("this  is the form data"+form)
        // const  name=document.getElementById('name').value;
        // const email=document.getElementById('email').value;
        updateData(form,"data")

    })
}
