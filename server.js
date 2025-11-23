require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const publicRoutes = require('./src/routes/publicRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Halaman admin di http://localhost:${port}/admin`);
});