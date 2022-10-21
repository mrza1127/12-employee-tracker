const mysql = require('mysql2')
const util = require('util')

// connecting to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // mysql user
        user: 'root',
        // password
        password: ' ',
        database: 'employee_tracker'
    }
)

db.query = util.promisify(db.query)

module.exports = db