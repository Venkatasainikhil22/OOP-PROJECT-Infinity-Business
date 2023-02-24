// require library 
const mongoose = require('mongoose');
// connect with database 
mongoose.connect(process.env.MONGO_URI);
// checking the connection
const db = mongoose.connection;
// if error through this 
db.on('error',console.error.bind(console,'error on connectin to database'));
// if successfull this show this 
db.once('open',function(){
    console.log('successfully connected to the database');
});