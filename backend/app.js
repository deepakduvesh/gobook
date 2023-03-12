const dotenv  = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const alert = require('alert');
dotenv.config({path:'./config.env'});
require('./db/connec');
const User = require('./model/user');
const Hotel = require('./model/hotel');
const PORT = process.env.PORT;
process.env.DATABASE;
var express = require("express");
var app = express();
var port = 3000;
// app.use(require('./router/auth'));
app.use(bodyParser.urlencoded({
    extended:true
}));

// for signin

app.get("/", (req, res) => {
    app.use(express.static("../frontend"));
    res.sendFile(path.join(__dirname, "../frontend", "/signin.html"));
});
 
app.post("/", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          //check if password matches
          const result = req.body.psw === user.password;
          if (result) {
           res.sendFile(path.join(__dirname,"../frontend", "/home.html"));
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
            
          res.sendFile(path.join(__dirname, "../frontend", "/signup.html"));
        }
      } catch (error) {
        res.status(400).json({ error });
      } 
});

// for signup

app.get("/signup", (req, res) => {
  app.use(express.static("../frontend"));
  res.sendFile(path.join(__dirname, "../frontend", "/signup.html"));
});


app.post("/signup",(req,res)=>{

  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;
  if(!email || !password || !cpassword){

      return res.json({error: "fill properly!!"});

  }
  if(password!=cpassword){
    
      return res.json({error: "password not match!!"});
  }

  User.findOne({email:email,password:password})
  .then((userExist)=>{
      if(userExist)
      return res.status(422).json({ error :"email exists already"});
      
      const user = new User({email:email,password:password});

      user.save().then(() => {
          res.status(201).json({message: "registered !! "});
      }).catch((err) => res.status(500).json({error: "failed to register !! "}));


  }).catch(err => {console.log(err); });


  // console.log(req.body);
  // res.json({message:req.body});
});

//signup hotel 

app.get("/signuphotel", (req, res) => {
  app.use(express.static("../frontend"));
  res.sendFile(path.join(__dirname, "../frontend", "/signuphotel.html"));
});

// post for signuphotel

app.post("/signuphotel",(req,res)=>{

  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;
  const name = req.body.name;
  const price = req.body.price;
  const city = req.body.city;
  const address = req.body.address;
  const contact = req.body.contact;


  if(password!=cpassword){
    
      return res.json({error: "password not match!!"});
  }
// checking for contact number
  con = String(contact)
  if(con.length!=10) return res.json({error : "not valid number"});

  Hotel.findOne({email:email,password:password})
  .then((userExist)=>{
      if(userExist)
      return res.status(422).json({ error :"email exists already"});
      
      const hotel = new Hotel({email:email,password:password,name:name,price:price,city:city,address:address,contact:contact});

      hotel.save().then(() => {
          res.status(201).json({message: "registered !! "});
      }).catch((err) => res.status(500).json({error: "failed to register !! "}));


  }).catch(err => {console.log(err); });


  // console.log(req.body);
  // res.json({message:req.body});
});


//signin hotel

app.get("/signinhotel", (req, res) => {
  app.use(express.static("../frontend"));
  res.sendFile(path.join(__dirname, "../frontend", "/signinhotel.html"));
});

app.post("/signinhotel", async function(req, res){
  try {
      // check if the user exists
      const hotel = await Hotel.findOne({ email: req.body.email });
      if (hotel) {
        //check if password matches
        const result = req.body.psw === hotel.password;
        if (result) {
         res.sendFile(path.join(__dirname,"../frontend", "/homehotel.html"));
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
          
        res.sendFile(path.join(__dirname,"../frontend", "/signuphotel.html"));

      }
    } catch (error) {
      res.status(400).json({ error });
    } 
});


app.listen(port, () => {
 console.log("Server listening on port " + port);
});