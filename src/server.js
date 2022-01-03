const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const unless = require('express-unless')
const auth = require('./helpers/jwt.js');
// const users = require('../server/controllers/UserController.js')
const users = require('./controllers/UserController.js')
const errors = require('./helpers/errorHandler.js')

var corsOptions = {
    origin: ["http://localhost:8081", "https://khojj.co", "https://app.khojj.co"],
  };
app.use(cors(corsOptions)) // Default = CORS-enabled for all origins Access-Control-Allow-Origin: *!
app.use(express.json()) // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

// middleware for authenticating token submitted with requests
auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/api/auth/login', methods: ['POST']},
        { url: '/api/auth/signup', methods: ['POST']}
    ]
}))

app.use('/api/auth', users) // middleware for listening to routes
app.use(errors.errorHandler); // middleware for error responses

// MongoDB connection, success and error event responses
const uri = "mongodb+srv://jabezreuben:coffeegeek1!Admin@cluster0.cl6j3.mongodb.net/khojj-database?retryWrites=true&w=majority";
mongoose.connect(uri, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to mongo at ${uri}`));

app.listen(3000);