console.log('hellow parcecel')
import '@babel/polyfill';
import {login, logout} from './login'
import {updateData} from './updateSetting'
import { showAlert } from './alert';
import {bookTour} from './stripe';

const loginForm=document.querySelector('.form--login');
const logoutbtn=document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data');
const Bookbtn=document.getElementById('book-tour')
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
        const photoInput=document.getElementById('photo');
        if(photoInput.file.length>0){
            form.append('photo',photoInput.files[0])
        }else{
            console.log("no photo selected")
            showAlert('error','please select a photo to upload')
            return;
        }
        // form.append('photo',document.getElementById('photo').files[0])
        console.log("Form data before upload:", Array.from(form.entries()));
        // const  name=document.getElementById('name').value;
        // const email=document.getElementById('email').value;
        try{
            updateData(form,"data")
        }catch(error){
            console.error('Error uploading data:',error)
            showAlert('error','failed to upload data.please try again ')
        }

    })
}
if(Bookbtn)
    Bookbtn.addEventListener('click',e=>{
        e.target.textContent ='processing ...'
        // in the pug the tour-id is changed in to camel case which is tourId
        const {tourId}=e.target.dataset;
        bookTour(tourId)

    })