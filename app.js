var express =require("express");
var path = require("path");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(session({
    secret:'secret123',
    saveUninitialized:true,
    resave:true
}));
// app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

//Express messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.get("/", function (req, res) {
    res.render('index', {title: 'Welcome'});
});

app.get("/about", function (req, res) {
    res.render('about');
});

app.get("/contact", function (req, res) {
    res.render('contact');
});

app.post("/contact/send", function (req, res) {
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user:'example@gmail.com',
            pass:'password'
        }
    });

    var mailOptions = {
        from: 'Victor Churchill <email@gmail.com>',
        to: 'email@gmail.com',
        subject:" Website Submission",
        text:'You have a submission with the following details... Name: '+ req.body.name+ "Email: " + req.body.email+ "Message: " + req.body.message,
        html:'<p>You have a submission with the following details... Name: </p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            req.flash('error', 'Your message has not been submitted try again');            
            console.log(error);
            res.redirect('/');
        } else {
            req.flash('success', 'Your message been submitted ' + req.body.name);
            console.log('Messagee sent: '+info.response);
            res.redirect('/');
        }
    });
});

app.listen(3000);
console.log('Server is running on port 3000...')

