// require library 
const mongoose = require('mongoose');
// connect with database 
mongoose.connect('mongodb+srv://tarun9068:9068855059Vats@cluster0.c41u0.mongodb.net/signin_updb?retryWrites=true&w=majority');
// checking the connection
const db = mongoose.connection;
// if error through this 
db.on('error',console.error.bind(console,'error on connectin to database'));
// if successfull this show this 
db.once('open',function(){
    console.log('successfully connected to the database');
});