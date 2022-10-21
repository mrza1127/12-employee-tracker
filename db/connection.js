const mysql = require('mysql2')

// connecting to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // mysql user
        user: '',
        // password
        password: '',
        database: 'employee_tracker'
    }
)

module.exports = db