const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { title } = require('process');

const app = express();

app.set("views", path.join(__dirname,"views"));//look for template files in the views  folder
app.set("view engine", "ejs");//sets our app to use ejs and view engine

const assetsPath = path.join(__dirname,"public");
app.use(express.static(assetsPath));

let entries = [];//create a global array to store all our entries
app.locals.entries = entries;//makes this entries array available to all views

app.use(logger('dev'));//uses morgan to log every request

app.use(bodyParser.urlencoded({extended: false}));//populates req.body when user submits form

//when visiting site root, renders the homepage
app.get('/',(req, res) => {
    res.render('index')
});

//renders the "new entry" page when GETting the URL
app.get('/new-entry', (req, res) => {
    res.render('new-entry')
});

//
app.post('/new-entry', (req, res) => {
    //if user submits a form without a title or content, respond with a 400 error
    if (!req.body.title || !req.body.body) {
        res.status(400).send('Entries must have a title and a body.')
    }
    //adds new entry to the list of entries
    entries.push({
        title: req.body.title,
        content: req.body.body,
        published: new Date()
    });
    res.redirect('/')//redirects to the homepage to see your new entry
});

//renders a 404 page because you are requesting an unknown source
app.use((req, res) => {
    res.status(404).render('404')
});

//middleware to handle 505 errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(505).send('Something went wrong! Please try again later')

});

//starts the server at port 3000
http.createServer(app).listen(3000, () => {
    console.log('Guestbook app started at post 3000')
});