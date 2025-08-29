const express = require('express');
const mongoose = require('mongoose');
const { render } = require('ejs');
const engine = require('ejs-mate');
const Product = require('./init/index.js');
const path = require('path');
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
app.get('/admin', (req, res) => {
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
// add products
app.post('/', (req, res) => {
  let product = {
    id: Math.floor(Math.random(50) + 1),
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image,
  };
  products.push(product);
  res.redirect('/');
});
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

