const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const nodemailer = require('nodemailer');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {Admin} = require('./init/adminuser.js');


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
const webcookie = require('./web_cookie/cookie.js');


const sessionOption = {
  secret: "Mynameisasifhussain",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 4 * 24 * 60 * 60 * 1000,
    Maxage: 4 * 24 * 60 * 60 * 1000,
    myhttp:true
 }
}
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
// Authenticating
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());




app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.delreview = req.flash('delreview');
  res.locals.addreview = req.flash('addreview');
  res.locals.delprod = req.flash('delprod');
  res.locals.addprod = req.flash('addprod');
  res.locals.updateprod = req.flash('updateprod');
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

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
app.use('/', webcookie);
app.use('/', defaultroute);


