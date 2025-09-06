const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const ExpressError = require('./views/ExpressError');
const nodemailer = require('nodemailer');
const path = require('path');
const { Review } = require('./init/review.js');
const sendMessageFromUser = require('./contactemail.js');
const { Product } = require('./init/index.js');
const { Customer } = require('./init/customer.js');
const { Cart } = require('./init/index.js');
const { Admin } = require('./init/adminuser.js');
const sendEmail = require('./email.js');
const { defaultresponse } = require('./views/deflauthandler');

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

// Async wrap middleware
function asyncwrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) =>
      next(new ExpressError(500, 'Something went wrong!'))
    );
  };
}

// Routes
app.get(
  '/',
  asyncwrap(async (req, res) => {
    res.render('main');
  })
);

app.get(
  '/products',
  asyncwrap(async (req, res) => {
    const products = await Product.find();
    res.render('home.ejs', { products });
  })
);

// Admin panels
async function countproduct() {
  const products = await Product.find();
  let count = 0;
  products.forEach((p) => (count += p.stock));
  return count;
}

async function order() {
  return await Customer.countDocuments();
}

app.get(
  '/admin',
  asyncwrap(async (req, res) => {
    const totalorder = await order();
    const count = await countproduct();
    const products = await Product.find();
    res.render('admin', { products, count, totalorder });
  })
);

// View product details
app.get(
  '/admin/view/:id',
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const prod = await Product.findById(id).populate('reviews');
    const reviews = prod.reviews;
    if (!prod) return res.send('Product not found!');
    res.render('view.ejs', { prod, reviews });
  })
);

// Edit product
app.get(
  '/admin/edit/:id',
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const prod = await Product.findById(id);
    if (!prod) return res.send('Product not found!');
    res.render('edit.ejs', { prod });
  })
);

app.post(
  '/admin/edit/:id',
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const { item, price, stock, image } = req.body;
    const product = await Product.findById(id);
    if (product) {
      product.item = item;
      product.price = Number(price);
      product.stock = Number(stock);
      product.image = image;
      await product.save();
    }
    res.redirect('/admin/view/' + id);
  })
);

// Delete product
app.get(
  '/admin/delete/:id',
  asyncwrap(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  })
);

// Add product
app.get(
  '/admin/add',
  asyncwrap(async (req, res) => {
    res.render('add');
  })
);

app.post(
  '/admin/add',
  asyncwrap(async (req, res) => {
    const { item, price, stock, image } = req.body;
    await Product({ item, price, stock, image }).save();
    res.redirect('/admin');
  })
);

// Admin signup
app.get(
  '/signup',
  asyncwrap(async (req, res) => {
    res.render('siginup');
  })
);

app.post(
  '/signup',
  asyncwrap(async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.send(
        "<script>alert('This email is already taken!'); window.location='/signup'</script>"
      );
    }
    await Admin({ email, password }).save();
    res.send(
      "<script>alert('New user is successfully added!'); window.location='/admin'</script>"
    );
  })
);

// Admin signin
app.get(
  '/signin',
  asyncwrap(async (req, res) => {
    res.render('siginin');
  })
);
// cart
app.post(
  '/products/cart/remove/:id',
  asyncwrap(async (req, res) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/products/cart');
  })
);

// Checkout
app.get(
  '/products/cart/checkout',
  asyncwrap(async (req, res) => {
    try {
      const cartItems = await Cart.find();
      console.log('Cart items:', cartItems);
      res.render('checkout', { cartItems });
    } catch (err) {
      console.error('Checkout GET error:', err);
      throw err;
    }
  })
);
app.post(
  '/signin',
  asyncwrap(async (req, res) => {
    const user = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user)
      return res.send(
        "<script>alert('Invalid email or password!'); window.location='/signin';</script>"
      );
    res.redirect('/admin');
  })
);

// Cart & checkout
app.get(
  '/products/cart',
  asyncwrap(async (req, res) => {
    const prod = await Cart.find();
    const bill = prod.reduce((sum, p) => sum + p.price, 0);
    res.render('cart', { prod, bill });
  })
);

app.get(
  '/products/cart/:id',
  asyncwrap(async (req, res) => {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.send('Product not found!');
    await Cart({
      item: prod.item,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
    }).save();
    res.redirect('/products/cart');
  })
);

app.post(
  '/products/cart/checkout',
  asyncwrap(async (req, res) => {
    const { username, email, payment } = req.body;
    const cartItems = await Cart.find();
    if (!cartItems.length)
      return res.send(
        "<script>alert('Cart is empty!'); window.location='/products/cart';</script>"
      );

    await Customer({ username, email, orders: cartItems }).save();
    await Cart.deleteMany({});
    return res.redirect('/products');
  })
);

// Email subscription
app.get(
  '/sub',
  asyncwrap(async (req, res) => {
    const { email } = req.query;
    if (!email)
      return res.send(
        "<script>alert('Please enter a valid email!'); window.location='/';</script>"
      );
    await sendEmail(email);
    res.send(
      "<script>alert('Subscription successful! Check your email!'); window.location='/';</script>"
    );
  })
);
// contact us
app.get(
  '/contact',
  asyncwrap(async (req, res) => {
    res.render('contact');
  })
);
// contact email
app.post(
  '/contact',
  asyncwrap(async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(req.body);

    if (!email || !message) {
      return res.send(
        "<script>alert('Please fill all fields!'); window.location='/contact';</script>"
      );
    }

    await sendMessageFromUser({ userEmail: email, subject, message, name });
    res.send(
      "<script>alert('Message sent successfully!'); window.location='/contact';</script>"
    );
  })
);
// reviews Hanlde
app.post(
  '/admin/view/:id/reviews',
  asyncwrap(async (req, res) => {
    let { id } = req.params;
    let prod = await Product.findById(id);
    let { comment, rating } = req.body;
    let review = new Review({
      comment,
      rating,
      createdat: Date.now(),
    });
    review.save();
    prod.reviews.push(review);
    console.log(review);
    await prod.save();
    res.redirect(`/admin/view/${id}`);
  })
);
// Delete the reviews
app.post(
  '/admin/view/:id/reviews/:reviewid',
  asyncwrap(async (req, res) => {
    const { id, reviewid } = req.params;

    // Find product
    let prod = await Product.findById(id).populate('reviews');
    if (!prod) {
      return res.status(404).send("Product not found");
    }

    prod.reviews = prod.reviews.filter((r) => r.toString() !== reviewid);
    await prod.save();

    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/admin/view/${id}`); // back to product page
  })
);

// Customer panel
app.get('/user', (req, res) => res.render('customer'));

// Default response
app.use((req, res) => res.send(defaultresponse));

// Error handler
app.use((err, req, res, next) => {
  const { status = 404, message = 'Something went wrong!' } = err;
  res.status(status).send(message);
});
