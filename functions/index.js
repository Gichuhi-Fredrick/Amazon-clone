const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(
  'sk_test_51Kln9LLGsLdoY76qBDvB0xQMGowua7W7jf4FwcXY6LFvLSEqLai0v2WH0mbYfLfFTDVBIdVCqYcyT5gOa3Upe0q700Jec5fNky');

// API

// Api config
const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

//Api routes
app.get('/', (req, res) => res.status(200).send('I am the server'));

app.post('/payments/create', async (req, res) => {
  // can use req.params too
  const total = req.query.total;

  console.log('Payment req received', total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
    // payment_method_types: ['card'],
  });

  res.send({ client_secret: paymentIntent.client_secret });
});

//Listen command
exports.api = functions.https.onRequest(app);
