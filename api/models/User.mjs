export default class User {
    constructor(db) {
      this.db = db;
    }
 
    all(callback) {
        this.db.query('SELECT * FROM users', callback);
    }

    visitors(callback) {
        const query = "SELECT users.id AS id, name AS username, email, first_name, last_name, dob " + 
            "FROM users " + 
            "LEFT JOIN records ON records.owner=users.id " +
            "WHERE role = 'visitor'";

        this.db.query(query, callback);
    }

    create(data, callback) {
        this.db.query('INSERT INTO users (email, name, password, role, token) VALUES (?, ?, ?, ?, ?)', data, callback);
    }

    login(data, callback){
        let user = data[0]; // username or email
        this.db.query(`SELECT * FROM users WHERE name = '${user}' OR email = '${user}'`, null, callback);
    }

    createToken(data, callback){
        this.db.query('UPDATE users SET token = ? WHERE id = ?', data, callback);
    }

    delete(data, callback) {
        const query = "DELETE FROM users " +
            "WHERE role = 'visitor' AND id = ?";

        this.db.query(query, data, callback);
    }

    find(data, callback) {
        const query = "SELECT users.id AS id, name AS username, email, first_name, last_name, dob " + 
            "FROM users " + 
            "LEFT JOIN records ON records.owner=users.id " +
            "WHERE role = 'visitor' AND users.id = ?";

        this.db.query(query, data, callback);
    }
}