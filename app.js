const express = require('express');
const mongoose = require('mongoose');
const { render } = require('ejs');
const engine = require('ejs-mate');
const { Product } = require('./init/index.js');
const { Cart } = require('./init/index.js');
const { Admin } = require('./init/adminuser.js');
const path = require('path');
const { resolveCaa } = require('dns');
const app = express();
const port = 8080;
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
}
main()
  .then(() => {
    console.log('Connection is build...');
  })
  .catch((err) => console.log(err));
app.listen(port, () => {
  console.log('server is started....');
});

// Middleware for admin
// app.use("/admin", (req, res, next) => {
//   res.render("/siginin").then(() => {
//     next();
//   }).catch(err => {
//     console.log("Not run the middle ware render")
//   })
// })
app.get('/', async (req, res) => {
  res.render('main');
});
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home.ejs', { products });
  } catch (err) {
    console.log(err);
  }
});

// Admin panels
async function countproduct() {
  const products = await Product.find();
  let count = 0;
  let total = 0;
  products.forEach((prod) => {
    count = count + prod.stock;
    total = total + 1;
  });
  console.log(total);
  return count;
}
let aadmin=app.get('/admin', (req, res) => {
  let count = 0;
  countproduct()
    .then(async (result) => {
      count = result;
      console.log(result);
      const products = await Product.find();
      res.render('admin', { products, count });
    })
    .catch((err) => {
      console.log(err);
    });
});
//
// view details
app.get('/admin/view/:id', async (req, res) => {
  let { id } = req.params;
  // convert string → number
  let prod = await Product.findById(id);
  console.log(id);
  if (!prod) {
    return res.send('Product not found!');
  }

  res.render('view.ejs', { prod });
});

// edit product details not update id other update

app.get('/admin/edit/:id', async (req, res) => {
  let { id } = req.params;
  let prod = await Product.findById(id);
  if (!prod) {
    return res.send('Product not found!');
  }
  res.render('edit.ejs', { prod });
});
// post
app.post('/admin/edit/:id', async (req, res) => {
  let { id } = req.params;
  let { item, price, stock, image } = req.body;
  price = Number(price);
  stock = Number(stock);
  const product = await Product.findById(id);
  if (product) {
    product.item = item;
    product.price = price;
    product.stock = stock;
    product.image = image;
    await product.save();
  }

  res.redirect('/admin/view/' + id);
});

// delete the products
app.get('/admin/delete/:id', async (req, res) => {
  let { id } = req.params;
  products = await Product.findByIdAndDelete(id);
  console.log('Product is deleted');
  res.redirect('/admin');
});

// add products

app.get('/admin/add', (req, res) => {
  res.render('add');
});
app.post('/admin/add', async (req, res) => {
  try {
    const { item, price, stock, image } = req.body;
    await Product({
      item: item,
      price: price,
      stock: stock,
      image: image,
    }).save();
    res.redirect('/admin');
  } catch (err) {
    console.log('Not add the products');
  }
});
// Admin signup
app.get('/signup', (req, res) => {
  res.render('siginup');
});
// post req

app.post('/signup', async (req, res) => {
  try {
    const user = new Admin({
      email: req.body.email,
      password: req.body.password,
    });

    // check if email exists
    let user1 = await Admin.findOne({ email: req.body.email });
    if (user1) {
      return res.send(
        "<script>alert('This email is already taken!'); window.location='/signup'</script>"
      );
    }

    // save new user
    await user.save();
    res.send(
      "<script>alert('New user is successfully added!'); window.location='/admin'</script>"
    );
  } catch (err) {
    console.log(err);
    res.send(
      "<script>alert('Something went wrong!'); window.location='/signin/home/add'</script>"
    );
  }
});
// Siginin

app.get('/signin', (req, res) => {
  res.render('siginin');
});
// post
app.post('/signin', async (req, res) => {
  try {
    let user = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return res.send(
        "<script>alert('Invalid email or password!'); window.location='/signin';</script>"
      );
    }

    aadmin();
  } catch (err) {
    console.log(err);
    res.send('Something went wrong!');
  }
});
// add to cart
app.get('/products/cart/:id', async (req, res) => {
  let { id } = req.params;
  const products = await Product.findById(id);

  await Cart({
    item: products.item,
    price: products.price,
    stock: products.stock,
    image: products.image,
  }).save();

  res.redirect('/products/cart'); // ✅ redirect, not render
});

// show cart
app.get('/products/cart', async (req, res) => {
  const prod = await Cart.find();
  const bill = Calculatebill(prod);
  res.render('cart', { prod, bill });
});

function Calculatebill(prod) {
  let sum = 0;
  prod.forEach(product => {
    sum = sum + product.price;
  })
  return sum;
}
// remove from cart
app.post('/products/cart/remove/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.redirect("/products/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error removing item");
  }
});
