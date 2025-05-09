// een bestelling zoals ze van de java-backend zou komen als DTO:
const order = {
    id: 1,
    lastName: "Familienaam",
    firstName: "Voornaam",
    reservationTime: "18:30",
    email: "mail.adres@gmail.com",
    comments: "",
    dishes: [{id: 1, name: "Mosselen met frietjes", amount: 4, unitPrice: 20}, 
             {id: 2, name: "Videe met frietjes", amount: 2, unitPrice: 15}, 
             {id: 3, name: "Frikandel met frietjes", amount: 1, unitPrice: 12}],
    orderstatus: "PLACED",
    amountPaid: 0,
}

// expressJS opzet
import express from 'express'
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public'));

// stripe client opzetten
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51R46NdFZxzYTUHg2NxBteNzUkTqhwY72yAkklndmY5Qo6QPHqx9TbOBywuDe7zoMhrDhEj62RX9w7evRyIAYxPqW00fei0BlKS');

// payment object aanmaken:
function createPaymentObject(placedOrder) {
    return {
        payment_method_types: ['card', 'bancontact'],
        mode: 'payment',
        line_items: placedOrder.dishes.map(dish => {
            return { 
                price_data: {
                    currency: 'EUR',
                    product_data: {name: dish.name},
                    unit_amount: dish.unitPrice * 100,
                },
                quantity: dish.amount,
            }
        }),
        success_url: 'http://localhost:80',
        cancel_url: 'http://localhost:80',
        customer_email: placedOrder.email,
    }
}

app.get('/payment/start', async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create(createPaymentObject(order));
        res.redirect(session.url)
    } catch(e){
        res.status(500).redirect('http://localhost:80');
    }
})

app.listen(port);