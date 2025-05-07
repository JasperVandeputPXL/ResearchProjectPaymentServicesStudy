require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// TODO: Set private key into .env file
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const stripe = require('stripe')("sk_test_51R46NdFZxzYTUHg2NxBteNzUkTqhwY72yAkklndmY5Qo6QPHqx9TbOBywuDe7zoMhrDhEj62RX9w7evRyIAYxPqW00fei0BlKS");

// Define storeItems on the server so people can't manipulate the API request
const storeItems = new Map([
    // Price needs to be in cents, not in euros
    [1, {priceInCents: 2000, name: "Mosselen met frietjes"}],
    [2, {priceInCents: 1500, name: "Videe met frietjes"}],
    [3, {priceInCents: 1500, name: "Spaghetti"}],
    [4, {priceInCents: 1200, name: "Frikandel met frietjes"}],
])

app.post('/create-checkout-session', async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['bancontact', 'ideal'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'EUR',
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity,
                }
            }),
            // TODO: change localhost to .env path
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });
        res.json({ url: session.url })
    }catch(e){
        res.status(500).json({ error: e.message });
    }
})

app.listen(3000)