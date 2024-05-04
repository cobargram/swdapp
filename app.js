import { Db } from "./api/database.mjs"
import express from "express"
import bodyParser from "body-parser"
import session from "express-session"
import { v4 } from "uuid"

import env from "./api/util.mjs"

import userController from './api/controllers/UserController.mjs'
import recordController from './api/controllers/RecordController.mjs'

// initialize and start express server
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// create DB connection
const con = Db.con();

Db.createDb(con);

app.use(
    session({ 
        name:'SessionCookie',
        genid: function(req) {
            console.log('session id created');
            return v4();
        },
        secret: env.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, expires: 200000 }
    })
);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("server running on port: ", port);
});

// create apis
const prefix = "/api/";

/* USERS */
userController.injectDB(con);

const userPrefix = `${prefix}users/`;
app.post(`${userPrefix}register`, userController.createUser);
app.post(`${userPrefix}login`, userController.loginUser);
app.get(`${userPrefix}`, userController.getAllUsers);
app.get(`${userPrefix}visitors`, userController.listOfVisitors);
app.delete(`${userPrefix}`, userController.deleteUser);
app.get(`${userPrefix}find/:id`, userController.findUser);
/* end USERS */

/* RECORDS */
recordController.injectDB(con);

const recordPrefix = `${prefix}records/`;
app.put(`${recordPrefix}update/:id`, recordController.updateRecord);
/* end RECORDS */

// create page links
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "." });
});

app.get("/visitor/:username", (req, res) => {
    userProfile(req, res, "visitor");
});

app.get("/nurse/:username", (req, res) => {
    userProfile(req, res, "nurse");
});

const userProfile = (req, res, role, file) => {
    const user = req.session.user;

    if(user){
        const { username } = req.params;

        if(user.role==role && user.username==username){
            res.sendFile(`${role}.html`, { root: "." });
        }
        else {
            if(user.role!=role){
                res.status(500).send("You're not authorized to access this page!");
            }
            else if(user.username!=username){
                res.status(500).send("The username you provided is invalid!");
            }
        }
    }
    else{
        res.status(500).send("You're not authorized to access this page!");
    }
}

app.get("/register", (req, res) => {
    res.sendFile(`register.html`, { root: "." });
});

app.get("/visitor/:id/edit", (req, res) => {const user = req.session.user;
    if(user && user.role=="nurse"){
        return res.sendFile("edit.html", { root: "." });
    }

    res.status(500).send("You're not authorized to access this page!");
});

app.get("*", (req, res) => {
    res.status(404).send("Page not found");
});