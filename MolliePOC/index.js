// een bestelling zoals ze van de java-backend zou komen als DTO:
let order = {
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
import express from 'express';
const app = express();
app.use(express.json());

// mollie client opzetten
import { createMollieClient } from '@mollie/api-client';
const mollieClient = createMollieClient({ apiKey: 'test_uSTyyjBGrxeJUkaDx4dFzGdzr6kuGA' });

// payment object aanmaken:
function createPaymentObject(placedOrder) {
  return {
    amount: { 
      value: placedOrder.dishes.map(dish => dish.amount * dish.unitPrice).reduce((sum, lineCost) => sum + lineCost).toFixed(2),
      currency: 'EUR'
    },
    description: placedOrder.lastName,
    redirectUrl: "http://localhost:80",
    lines: placedOrder.dishes.map(dish => {
      return {
        description: dish.name,
        unitPrice: { currency: 'EUR', value: dish.unitPrice.toFixed(2) },
        quantity: dish.amount,
        totalAmount: { currency: 'EUR', value: (dish.amount * dish.unitPrice).toFixed(2) }
      }
    })
  }
}

app.get('/payment/start', async (req, res) => {    
    if (req.body && req.body.hasOwnProperty("order")) {
        order = req.body.order;
    }
    const payment = await mollieClient.payments.create(createPaymentObject(order));
    res.redirect(302, payment.getCheckoutUrl());
});

app.listen(4001);
