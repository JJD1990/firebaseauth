const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser')
const express = require('express');
const ejs = require('ejs');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL:  ""
})

const csrfMiddleware = csrf({ cookie: true });

const app = express();


// set the view engine to ejs
// app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// use res.render to load up an ejs view file

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all('*', (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
})

// index page
app.get('/', (req, res) => {
    res.render('index');
});

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send("UNAUTHORIZED REQUEST!");
            }
        );
});

// about page
app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.get('/signin', (req, res) => {
    res.render('pages/signin');
});

app.get("/admin", function (req, res) {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((userData) => {
            console.log("Logged in:", userData.email)
            res.render("pages/admin");
        })
        .catch((error) => {
            res.redirect("/signin");
        });
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    console.log("User logged out")
    res.redirect("/signin");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

