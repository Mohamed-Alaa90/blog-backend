require('dotenv').config();
const express = require('express');
const app = express();
const main = require('./server/routes/main');
const connectDB = require("./server/config/db")

connectDB();
app.use(express.static('public'));

//Layouts
const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', main);

const PORT = 5000 || process.env;
app.listen(PORT, () => {
  console.info('APP listen In Port', PORT);
});

