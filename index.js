const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/Pedalpe");
const express = require('express');
const Razorpay = require('razorpay');
const app = express();

var instance = new Razorpay({
	key_id: 'rzp_test_oVRiJDhZVjgwcn',
	key_secret: 'XcNnnsyxa78OAWEH6CJVfrkj',
});

var options = {
	amount: 5000,  // amount in the smallest currency unit
	currency: "INR",
	receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
	console.log(order);
  });




const userRoute = require('./routes/userRoute');

app.use('/', userRoute);


app.listen(3000, () => console.log('Server running on port 3000'));