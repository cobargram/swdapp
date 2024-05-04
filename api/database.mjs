import mysql from "mysql"
import bcrypt from "bcrypt"
import env from "./util.mjs"

export class Db {
    static con() {
        let con = mysql.createConnection({
            host: env.db.host,
            user: env.db.user,
            password: env.db.password
        });

        return con;
    }

    static sendQuery(query, con){
        con.query(query, 
            function (err, result) {
                if (err) throw err;

                if(result.warningCount == 0 && query.includes("CREATE DATABASE")){
                    Db.createTables(con);
                    Db.insertDefaultData(con);
                }
            }
        );
    }

    static createDb(con) {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");

            Db.sendQuery(`DROP DATABASE IF EXISTS ${env.db.name}`, con);
            Db.sendQuery(`CREATE DATABASE IF NOT EXISTS ${env.db.name}`, con);
            Db.sendQuery(`USE ${env.db.name}`, con);
        });
    }

    static createTables(con) {
        // table queries
        let table = {
            users: "CREATE TABLE IF NOT EXISTS users (" +
                        "id INT NOT NULL PRIMARY KEY AUTO_INCREMENT," +
                        "name VARCHAR(50) NOT NULL UNIQUE," +
                        "email VARCHAR(120) NOT NULL UNIQUE," +
                        "password text NOT NULL," +
                        "role VARCHAR(8) NOT NULL," + // role could be "nurse", "visitor"
                        "token text," +
                        "created_at DATETIME DEFAULT NOW()" +
                    ");",
            records: "CREATE TABLE IF NOT EXISTS records (" +
                        "id INT NOT NULL PRIMARY KEY AUTO_INCREMENT," +
                        "first_name VARCHAR(120) NOT NULL," +
                        "last_name VARCHAR(120) NOT NULL," +
                        "dob DATE NOT NULL," +
                        "owner INT NOT NULL," +
                        "nurse INT NOT NULL," +
                        "FOREIGN KEY (owner) REFERENCES users(id)," +
                        "FOREIGN KEY (nurse) REFERENCES users(id)," +
                        "created_at DATETIME DEFAULT NOW()" +
                    ");",
        };

        // create tables
        Db.sendQuery(table.users, con);
        Db.sendQuery(table.records, con);
    }

    static insertDefaultData(con){
        Db.createNurses(con);
        Db.createVisitor(con);
    }

    static async createNurses(con){
        env.nurses.forEach(nurse => {
            Db.encryptPasswordAndCreateUser(nurse, 'nurse', con);
        });
    }

    static async createVisitor(con){
        Db.encryptPasswordAndCreateUser(env.default_patient, 'visitor', con);
    }

    static async encryptPasswordAndCreateUser(user, role, con){
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
                return;
            }

            Db.sendQuery(`INSERT IGNORE INTO users (name, email, password, role) VALUES ('${user.name}', '${user.email}', '${hash}', '${role}');`, con);
        });
    }
}