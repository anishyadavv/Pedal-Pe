const User = require('../models/userModel');
const CycleUser = require('../models/cycleuserModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config');

const securePassword = async (password) => {
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    } 
};

const sendVerifyMail = async (email, name, id) => {
    try {
        const transporter =  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.userEmail,
                pass: config.userPass
            }
        });

        const mailOptions = {
            from: config.userEmail,
            to: email,
            subject:'For Verification Mail',
            html: `<h1>Hi ${name} ,please click here to <a href="http://localhost:3000/verify?id=${id}">Verify</a> your mail </h1>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error.message);
            }
            else{
                console.log('Email sent: '+info.response);
            }
        });

    } catch (error) {
        console.log(error.message);
    }
};

const sendResetPasswordMail = async (email, name, token) => {
    try {
        const transporter =  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.userEmail,
                pass: config.userPass
            }
        });

        const mailOptions = {
            from: config.userEmail,
            to: email,
            subject:'Reset Password Mail',
            html: `<h1>Hi ${name} ,please click here to <a href="http://localhost:3000/forgotPassword?token=${token}">Reset</a> your password </h1>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error.message);
            }
            else{
                console.log('Email sent: '+info.response);
            }
        });

    } catch (error) {
        console.log(error.message);
    }
};
            


const loadRegiser = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error.message);
    }
};


const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);

        const user = new User ({
            name: req.body.name,
            email: req.body.email,
            password: spassword,
        });
        const userData = await user.save();

        if(userData){
            sendVerifyMail(req.body.email, req.body.name,userData._id);
            res.render('signup', {message: 'User Registered Successfully, please verify your email'});
        }
        else{
            res.render('signup', {message: 'Error in registering user'});
        }
    } catch (error) {
        console.log(error.message);
    }
    
};

const verifyMail = async(req,res)=>{
    try {
        const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        console.log(updateInfo);
        res.render("emailVerified");
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async (req, res) => {
    try {
        res.render('signin');
    } catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email})

        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                if(userData.is_verified===0){
                    res.render('signin', {message: 'Please verify your email first'});
                }
                else{
                    req.session.user_id = userData._id;
                    res.render('wallet',{user:userData});
                }
            }
            else{
                res.render('signin', {message: 'Invalid Email or Password'});
            }
        }
        else{
            res.render('signin', {message: 'Invalid Email or Password'})
        }

    }
    catch(error){
        console.log(error.message);
    }
};
const loadHome = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log(error.message);
    }
};
const logOut = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/signin');
    } catch (error) {
        console.log(error.message);
    }
};

const loadForgot = async (req, res) => {
    try {
        res.render('forgotpassword');
    } catch (error) {
        console.log(error.message);
    }
};
const forgotPassword = async (req, res) => {
    try{
        const email = req.body.email;
        const UserData = await User.findOne({email:email});
        if(UserData){
            if(UserData.is_verified===0){
                res.render('forgotpassword', {message: 'Please verify your email first'});
            }
            else{
                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
                sendResetPasswordMail(UserData.email, UserData.name, randomString);
                res.render('forgotpassword', {message: 'Reset Password Link sent to your email'});
            }

        }
        else{
            res.render('forgotpassword', {message: 'Email not registered'});
        }

    }
    catch(error){
        console.log(error.message);
    }
};

const loadResetPassword = async (req, res) => {
    try{
        const token = req.query.token;
        const UserData = await User.findOne({token:token});
        if(UserData){
            res.render('resetPassword',{user_id: UserData._id});
        }
        else{
            res.render('404',{message:'Invalid Token'});
        }
        
    }
    catch(error){
        console.log(error.message);
    }
};

const resetPassword = async (req, res) => {
    try{
        const user_id = req.body.user_id;
        const password = req.body.password;
        const spassword = await securePassword(password);
        const userdata = await User.findByIdAndUpdate({_id:user_id},{$set:{password:spassword,token:''}});
        
        res.redirect('/signin');
    }
    catch(error){
        console.log(error.message);
    }
};

const landingPage = async (req, res) => {
    try {
        res.render('index');
    }
    catch(error){
        console.log(error.message);
    }
};

const loadWallet = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });

        res.render('wallet',{user:userData});
    }
    catch(error){
        console.log(error.message);
    }
};

const loadAbout = async (req, res) => {
    try {
        res.render('about');
    }
    catch(error){
        console.log(error.message);
    }
};
const loadStartRide = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });

        const cycleData = await CycleUser.findOne({id:userData._id});
        if(cycleData.status != 1|| cycleData.status=="undefined"){
            res.render('startride',{user:userData});
        }
        else{
            res.render('endride',{user: userData});
        }
        // res.render('startride',{user:userData});
        
    }
    catch(error){
        console.log(error.message);
    }
};

const add50 = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        const updatedData = await User.updateOne({ _id: req.session.user_id }, { $set: { balance: userData.balance + 50 } });
        res.render('wallet',{user:userData});
    }
    catch(error){
        console.log(error.message);
    }
};
const startride = async (req,res)=>{
    try{
        const date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        const cycleid = await CycleUser.findOne({id:req.session.user_id});
        if(cycleid){
            const cycleData = await CycleUser.updateMany({id:req.body.id},{$set:{cycleid:req.body.cycleid,starthour:hour,startminutes:minutes,startseconds:seconds,status:1}});
            if(cycleData){
                const userData = await User.findById({ _id: req.session.user_id });
                res.render('startride',{message:"Time is started Please logout",user:userData});
            }
            else{
                res.render('404');
            }
        }
        else{
            cycleid  = new CycleUser({
                id: req.body.id,
                cycleid: req.body.cycleid,
                starthour: hour,
                startminutes: minutes,
                startseconds: seconds,
                status:1
            })
    
            const cycledata = await cycleid.save();
    
            if(cycledata){
                const userData = await User.findById({ _id: req.session.user_id });
                res.render('startride',{message:"Time is started Please logout",user:userData});
            }
            else{
                res.render('404');
            }
        }
        


        

    }
    catch(error){
        console.log(error.message);
    }
};

const endride = async(req,res)=>{
    try{
        const date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        
       const cycleid = await CycleUser.updateMany({id:req.body.id},{$set:{endhour:hour,endminutes:minutes,endseconds:seconds,status:0}});
       if(cycleid){
            const userData = await User.findById({ _id: req.session.user_id });
            res.render('endride',{message:"Time is ended Please logout",user:userData});
       }
       else{
        res.render('404');
       }
        


    }
    catch(error){
        console.log(error.message);
    }
};

module.exports = {
    loadRegiser,
    insertUser,
    verifyMail,
    loadLogin,
    verifyLogin,
    loadHome,
    logOut,
    loadForgot,
    forgotPassword,
    loadResetPassword,
    resetPassword,
    landingPage,
    loadWallet,
    loadAbout,
    loadStartRide,
    add50,
    startride,
    endride
}
