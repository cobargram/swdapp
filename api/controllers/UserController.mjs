// controllers/userController.js
import User from '../models/User.mjs'
import { App } from '../util.mjs'
import bcrypt from 'bcrypt'

let user;

function injectDB(database) {
    user = new User(database);
}

function getAllUsers(req, res) {
    user.all((err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
}

async function loginUser(req, res) {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(201).json({ success: false, data: { message: "Some fields are missing!" } });
    }

    //username = App.sanitize(username);
    //password = App.sanitize(password);

    const data = [username];

    user.login(data, (err, results) => {
        if(err || results.length == 0){
            return res.status(201).json({ success: false, data: { message: "The Credentials you provided are invalid!" } });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, result) => {
            if(err){
                return res.status(201).json({ success: false, data: { message: "The Credentials you provided are invalid!" } });
            }

            if (result) {
                const token      = App.token();

                req.session.user = { token: token, username: user.name, role: user.role, id: user.id };

                createUserToken(token, user, res);
            } else {
                res.status(201).json({ success: false, data: { message: "The Credentials you provided are invalid!" } });
            }
        });
    });
}

async function createUserToken(token, userDetails, res) {
    const data  = [token, userDetails.id];
 
    user.createToken(data, (err, results) => {
        if(err){
            return res.status(201).json({ success: false, data: { message: "Could not create token... Something went wrong!" } });
        }

        res.status(200).json({ success: true, data: { token: token, username: userDetails.name, role: userDetails.role }});
    });
}

async function createUser(req, res) {
    const { email, username, password } = req.body;

    if(!email || !username || !password){
        return res.status(406).json({ success: false, data: { message: "Some Fields are missing" } });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ success: false, data: { message: err } });
        }
        
        const token = App.token();
        const role  = "visitor";
        const data  = [email, username, hash, role, token];

        user.create(data, (err, result) => {
            try{
                if(result==undefined || result.insertId==null){
                    res.status(201).json({ success: false, data: { message: "Username or Email already exists" } });
                }
                else{
                    const activeUser = req.session.user;

                    if(activeUser && activeUser.role=="nurse"){
                        role     = "nurse";
                        username = activeUser.username;
                    }

                    res.status(201).json({ success: true, data: { role, username } });
                }
            } catch(err) {
                return res.status(201).json({ success: false, data: { message: "Username or Email already exists", error: err} });
            }
        });
    });
}

async function listOfVisitors(req, res) {
    const activeUser = req.session.user;

    if(!activeUser || activeUser.role!="nurse"){
        return res.status(500).json({ success: false, data: { message: "You're not authorized to perform this action!" } });
    }

    user.visitors((err, result) => {
        try{
            if(result==undefined){
                res.status(201).json({ success: false, data: { message: "Something went wrong." } });
            }
            else{
                res.status(201).json({ success: true, data: result });
            }
        } catch(err) {
            return res.status(201).json({ success: false, data: { message: "Something went wrong", error: err} });
        }
    });
}

async function deleteUser(req, res) {
    const activeUser = req.session.user;

    if(!activeUser || activeUser.role!="nurse"){
        return res.status(500).json({ success: false, data: { message: "You're not authorized to perform this action!" } });
    }

    const { userId } = req.body;

    if(!userId){
        return res.status(500).json({ success: false, data: { message: "Some fields are missing" } });
    }

    const data = [userId];

    user.delete(data, (err, result) => {
        try{
            if(result!=undefined && result.affectedRows >= 1){
                res.status(200).json({success: true, data: {message: "The selected record was successfully removed!"}});
            }
            else{
                return res.status(200).json({success: false, data: {message: "Record does not exist!"}});
            }
        } catch(err) {
            return res.status(201).json({ success: false, data: { message: "Something went wrong", error: err} });
        }
    });
}


async function findUser(req, res) {
    const activeUser = req.session.user;

    if(!activeUser || activeUser.role!="nurse"){
        return res.status(500).json({ success: false, data: { message: "You're not authorized to perform this action!" } });
    }

    const { id } = req.params;

    if(!id){
        return res.status(500).json({ success: false, data: { message: "Some fields are missing" } });
    }

    const data = [id];

    user.find(data, (err, result) => {
        try{
            if(result!=undefined && result.length > 0){
                res.status(200).json({success: true, data: result[0]});
            }
            else{
                return res.status(200).json({success: false, data: { message: "Record does not exist!" }});
            }
        } catch(err) {
            return res.status(201).json({ success: false, data: { message: "Something went wrong", error: err } });
        }
    });
}

const UserController = {
    getAllUsers,
    createUser,
    injectDB,
    loginUser,
    listOfVisitors,
    deleteUser,
    findUser,
};

export default UserController;