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
const {Admin,User} = require('./init/adminuser.js');


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
const userroute = require('./routes/userrouter.js');

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

passport.use('admin-local', new LocalStrategy(Admin.authenticate()));
passport.use('user-local', new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  done(null, { id: user._id, kind: user.constructor.modelName });
});

passport.deserializeUser(async (obj, done) => {
  try {
    if (obj.kind === 'Admin') {
      const admin = await Admin.findById(obj.id);
      if (admin) admin.kind = "Admin";
      return done(null, admin);
    } else if (obj.kind === 'User') {
      const user = await User.findById(obj.id);
      if (user) user.kind = "User";
      return done(null, user);
    } else {
      return done(new Error('Unknown user type'), null);
    }
  } catch (err) {
    done(err, null);
  }
});



app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.rout = req.session.Urlredirect || null;

  
  if (req.user) {
    res.locals.user = req.user.username;
    res.locals.email = req.user.email;
  } else {
    res.locals.user = null;
    res.locals.email = null;
  }

  next();
});


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
app.use('/', userroute);
app.use('/', subroute);
app.use('/', webcookie);
app.use('/', defaultroute);


