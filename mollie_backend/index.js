import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createMollieClient } from '@mollie/api-client';

const mollieClient = createMollieClient({ apiKey: 'test_uSTyyjBGrxeJUkaDx4dFzGdzr6kuGA' });
const payments = new Map();

const app = express();
const port = 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/payment/start', async (req, res) => {
  try {
    const paymentId = uuidv4();
    const payment = await mollieClient.payments.create({
      amount: { value: '10.00', currency: 'EUR' },
      description: 'My first API payment',
      redirectUrl: 'http://localhost:4001/payment/complete/' + paymentId,
      /*webhookUrl: 'http://localhost/payment/webhook', not possible see below*/
      cancelUrl: 'http://localhost:4001/payment/cancel/' + paymentId,
    });

    payments.set(paymentId, payment.id);
    console.log('Payment created:', paymentId);

    if (payment.getCheckoutUrl() != null) {
      res.redirect(payment.getCheckoutUrl());
    } else {
      res.status(500).send('Error creating payment');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating payment');
  }
});

app.get('/payment/complete/:id', (req, res) => {
  const id = payments.get(req.params.id);
  if (!id) {
    return res.status(404).send('Payment not found');
  }

  mollieClient.payments.get(id).then((payment) => {
    console.log(payment);

    if (payment.status === 'paid') {
      console.log('Payment successful!', id);
      payments.delete(req.params.id);
      res.status(200);
    } else {
      console.log('Payment has failed or is still pending.', id);
      res.status(400);
    }
    res.send('Payment status checked. Check console for details.').end();
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error retrieving payment status');
  });
});

app.get('/payment/cancel/:id', (req, res) => {
  const id = payments.get(req.params.id);
  if (!id) {
    return res.status(404).send('Payment not found');
  }

  mollieClient.payments.get(id).then((payment) => {
    console.log(payment);

    if (payment.status === 'cancelled') {
      console.log('Payment cancelled!', id);
      payments.delete(req.params.id);
      res.status(200).send('Payment cancelled successfully!');
    } else {
      console.log('Payment has failed or is still pending.', id);
      res.status(400);
    }
    res.send('Payment status checked. Check console for details.').end();
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error retrieving payment status');
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
