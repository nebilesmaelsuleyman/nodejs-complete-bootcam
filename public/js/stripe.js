import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51QTM86HJoBzUtcVnSRtkEtEQ77Kp20sUIu11pzqw59uoRuHHivZcpV3e6z9yMotesPrNfriJsE8S5aRHVa3KudLK00ftCrkEOT');
export const bookTour = async (tourId) => {
try {

    // 1) Get checkout session from API
    const session = await axios({
        method:"Get",
        // dont forget to use the url as this the http:// localhost .... does'nt work as you expect
        url:`${location.origin}/api/v1/bookings/checkout-session/${tourId}`,
        // to insure cookies are passed
        withCredentials:true ,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-Type': 'application/json',
            }
        
    })

    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
    sessionId: session.data.session.id
    });
} catch (err) {
    console.log(err.message);
    showAlert('error', err);
}
};