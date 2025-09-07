const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const nodemailer = require('nodemailer');
const path = require('path');

// Routers
const productroute = require('./routes/productroute.js');
const adminroute = require('./routes/adminroute');
const viewroute = require('./routes/viewroute.js');
const addproductroute = require('./routes/addproductroute.js');
const editproduct = require('./routes/editroute.js');
const signuproute = require('./routes/signuproute.js');
const signinroute = require('./routes/signinroute.js');
const cartroute = require('./routes/cartroute.js');
const customerroute = require('./routes/customerroute.js');
const contactroute = require('./routes/constactroute.js');
const defaultroute = require('./routes/defaultroute.js');
const subroute = require('./routes/subroute.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then(() => console.log('Connection is built...'))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log('Server is started....'));



// All routes
app.use('/', productroute);
app.use('/', adminroute);
app.use('/', viewroute);
app.use('/', addproductroute);
app.use('/', editproduct);
app.use('/', signuproute);
app.use('/', signinroute);
app.use('/', cartroute);
app.use('/', customerroute);
app.use('/', contactroute);
app.use('/', subroute);
app.use('/', defaultroute);
