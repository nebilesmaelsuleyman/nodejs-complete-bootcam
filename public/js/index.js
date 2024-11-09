console.log('hellow parcecel')
import '@babel/polyfill';
import {login, logout} from './login'
const loginForm=document.querySelector('.form');
const logoutbtn=document.querySelector('.nav__el--logout')

if(loginForm){
     loginForm.addEventListener('submit',e=>{
    e.preventDefault(); 
    const email =document.getElementById('email').value;
    const password= document.getElementById('password').value;
    login(email,password )
})}

if(logoutbtn) logoutbtn.addEventListener('click',logout)