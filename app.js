const express=require("express");
const app=express();
const port=8080;
const { render } = require("ejs");
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(port,()=>{
    console.log("server is started....");
})
let users=[
    {
        username:"asifhussain5115@gmail.com",
        passworda:"12345"
    }
]
// sign up 
app.get("/signup",(req,res)=>{
   res.render("siginup.ejs");
})
app.post("/login",(req,res)=>{
    let {username,password}=req.body;
    let user={
        username,password
    };
    users.push(user);
    res.redirect("/login");
})
app.get("/login",(req,res)=>{
    res.render("siginin.ejs")
})
let products = [
  { id: 1, name: "Smartphone", price: 299, stock: 10, image: "https://picsum.photos/seed/p1/200/200" },
  { id: 2, name: "Laptop", price: 799, stock: 5, image: "https://picsum.photos/seed/p2/200/200" },
  { id: 3, name: "Headphones", price: 49, stock: 15, image: "https://picsum.photos/seed/p3/200/200" },
  { id: 4, name: "Smartwatch", price: 199, stock: 8, image: "https://picsum.photos/seed/p4/200/200" },
  { id: 5, name: "Tablet", price: 399, stock: 7, image: "https://picsum.photos/seed/p5/200/200" },
  { id: 6, name: "Bluetooth Speaker", price: 59, stock: 12, image: "https://picsum.photos/seed/p6/200/200" },
  { id: 7, name: "Camera", price: 499, stock: 6, image: "https://picsum.photos/seed/p7/200/200" },
  { id: 8, name: "Gaming Console", price: 349, stock: 4, image: "https://picsum.photos/seed/p8/200/200" },
  { id: 9, name: "Keyboard", price: 39, stock: 20, image: "https://picsum.photos/seed/p9/200/200" },
  { id: 10, name: "Mouse", price: 25, stock: 25, image: "https://picsum.photos/seed/p10/200/200" },
  { id: 11, name: "Monitor", price: 229, stock: 9, image: "https://picsum.photos/seed/p11/200/200" },
  { id: 12, name: "External Hard Drive", price: 89, stock: 11, image: "https://picsum.photos/seed/p12/200/200" },
  { id: 13, name: "Charger", price: 19, stock: 30, image: "https://picsum.photos/seed/p13/200/200" },
  { id: 14, name: "Power Bank", price: 35, stock: 18, image: "https://picsum.photos/seed/p14/200/200" },
  { id: 15, name: "Router", price: 69, stock: 10, image: "https://picsum.photos/seed/p15/200/200" },
  { id: 16, name: "USB Flash Drive", price: 15, stock: 40, image: "https://picsum.photos/seed/p16/200/200" },
  { id: 17, name: "Drone", price: 899, stock: 3, image: "https://picsum.photos/seed/p17/200/200" },
  { id: 18, name: "VR Headset", price: 299, stock: 5, image: "https://picsum.photos/seed/p18/200/200" },
  { id: 19, name: "Printer", price: 159, stock: 7, image: "https://picsum.photos/seed/p19/200/200" },
  { id: 20, name: "Smart Home Hub", price: 129, stock: 6, image: "https://picsum.photos/seed/p20/200/200" }
];

app.get("/",(req,res)=>{
    res.render("home.ejs",{products})
})
// Admin panels
app.get("/admin",(req,res)=>{
    res.render("admin.ejs",{products});
})
// add products
app.post("/",(req,res)=>{
    let product={
        id:Math.floor(Math.random(50)+1),
        name:req.body.name,
        price:req.body.price,
        stock:req.body.stock,
        image:req.body.image
    }
    products.push(product);
    res.redirect("/")
})
// view details
app.get("/admin/view/:id", (req, res) => {
  let { id } = req.params;
  id = Number(id);   // convert string → number
  let prod = products.find(p => p.id === id);
  
  if (!prod) {
    return res.send("Product not found!");
  }

  res.render("view.ejs", { prod });
});

// edit product details not update id other update

app.get("/admin/edit/:id",(req,res)=>{
    let{id}=req.params;
    id=Number(id);
    let prod = products.find(p => p.id === id);
    if (!prod) 
    {
      return res.send("Product not found!");
    }
   res.render("edit.ejs",{prod})
})
// post
app.post("/admin/update/:id",(req,res)=>{
  let {id}=req.params;
  let {name,price,stock,image}=req.body;
  let product=products.find(p=>p.id==id);
  if(product){
    product.name=name;
    product.price=price;
    product.stock=stock;
    product.image=image;
  }
  res.redirect("/admin/view/"+id);
});

// delete the products
app.get("/admin/delete/:id",(req,res)=>{
    let {id}=req.params;
    id=Number(id);
    products=products.filter(p=>p.id!==id);
    res.redirect("/admin");
})

// add cart 

app.get("/cart/:id",(req,res)=>{
   let {id}=req.params;
   id=Number(id);
   let prod=products.find(p=>p.id===id);
   res.render("cart.ejs",{prod});
})