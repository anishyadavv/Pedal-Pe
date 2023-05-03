const express = require('express');
const user_route = express();
const session = require('express-session');


const config = require('../config/config');
const auth = require('../middleware/auth');
user_route.use(session({secret:config.sessionSecret}));

user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');


const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
const multer = require('multer');
const path = require('path');
user_route.use(express.static(path.join(__dirname,'../public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{ 
        cb(null, path.join(__dirname,'../public/userImages'));
    },
    filename: (req, file, cb) =>{
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    }
});

const upload = multer({storage: storage});
const userController = require('../controllers/userController');




user_route.get('/signup',auth.islogout, userController.loadRegiser);
user_route.post('/signup',userController.insertUser);
user_route.get('/verify', userController.verifyMail);
user_route.get('/signin',auth.islogout, userController.loadLogin);
user_route.post('/signin', userController.verifyLogin);
user_route.get('/home',auth.islogin,userController.loadHome);
user_route.get('/',userController.landingPage);
user_route.get('/logout',auth.islogin, userController.logOut);
user_route.get('/forgot',auth.islogout, userController.loadForgot);
user_route.post('/forgot', userController.forgotPassword);
user_route.get('/forgotPassword',auth.islogout,userController.loadResetPassword);
user_route.post('/resetPassword', userController.resetPassword);
user_route.get('/wallet',auth.islogin,userController.loadWallet);
user_route.get('/about',userController.loadAbout);
user_route.get('/startride',auth.islogin,userController.loadStartRide);
user_route.post('/add50',auth.islogin,userController.add50);
user_route.post('/startride',userController.startride);
user_route.post('/endride',userController.endride);

module.exports = user_route;