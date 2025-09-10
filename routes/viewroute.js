const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { Review } = require('../init/review');
const islogin = require('../init/isloginadmin');

router.get(
  '/admin/view/:id',
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const prod = await Product.findById(id).populate('reviews');
    const reviews = prod.reviews;
    if (!prod) return res.send('Product not found!');
    res.render('view.ejs', { prod, reviews });
  })
);

router.post(
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
    req.flash('success', 'Review Added Successfully..');
    prod.reviews.push(review);
    console.log(review);
    await prod.save();
    res.redirect(`/admin/view/${id}`);
  })
);

// Delete the reviews
router.post(
  '/admin/view/:id/reviews/:reviewid',islogin,
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
    req.flash('success', "Review deleted Successfully...");
    res.redirect(`/admin/view/${id}`); // back to product page
  })
);

module.exports = router;