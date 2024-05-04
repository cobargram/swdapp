// controllers/recordController.js
import Record from '../models/Record.mjs'
import { App } from '../util.mjs'
import bcrypt from 'bcrypt'

let record;

function injectDB(database) {
    record = new Record(database);
}

async function updateRecord(req, res) {
    const activeUser = req.session.user;

    if(!activeUser || activeUser.role!="nurse"){
        return res.status(500).json({ success: false, data: { message: "You're not authorized to perform this action!" } });
    }

    const { id }                       = req.params;
    const { firstName, lastName, dob } = req.body;

    if(!id || !firstName || !lastName || !dob){
        return res.status(500).json({ success: false, data: { message: "Some fields are missing" } });
    }

    const data = [firstName, lastName, req.session.user.id, dob, id];

    console.log(data);

    record.update(data, (err, result) => {
        try{
            if(result!=undefined && result.affectedRows > 0){
                res.status(200).json({success: true, data: { message: "Record successfully updated!"}});
            }
            else{
                createRecord(data, res);
            }
        } catch(err) {
            return res.status(201).json({ success: false, data: { message: "Something went wrong", error: err } });
        }
    });
}

async function createRecord(data, res) {
    record.create(data, (err, result) => {
        try{
            if(result!=undefined && result.insertId!=null){
                res.status(200).json({success: true, data: { message: "Record successfully created!"}});
            }
            else{
                return res.status(200).json({success: false, data: { message: "Record does not exist!" }});
            }
        } catch(err) {
            return res.status(201).json({ success: false, data: { message: "Something went wrong", error: err } });
        }
    });
}

const RecordController = {
    updateRecord,
    injectDB,
};

export default RecordController;