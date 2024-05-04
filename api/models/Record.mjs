export default class Record {
    constructor(db) {
      this.db = db;
    }

    create(data, callback) {
        this.db.query('INSERT INTO records (first_name, last_name, nurse, dob, owner) VALUES (?,?,?,?,?)', data, callback);
    }

    update(data, callback) {
        this.db.query('UPDATE records SET first_name = ?, last_name = ?, nurse = ?, dob = ? WHERE owner = ?', data, callback);
    }
}