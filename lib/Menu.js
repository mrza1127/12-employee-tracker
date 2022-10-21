const inquirer = require('inquirer')
const db = require('../db/connection')
// const { viewRoles, viewDepartments } = require('./queries')
const cTable = require('console.table')

function getDepartmentNames() {
    const sql = `SELECT department.name FROM department ORDER BY name`
    const deptNames = []
    db.promise().query(sql, (err, rows) => {
        if (err) {
            console.log(`Error: ${err.message}`)
            return
        }
        // for each key/value in the rows returned, push just the name of the dept as a string into an array to return
        rows.forEach( row => {
            deptNames.push(row.name)
        })

        console.log(`in queries.js db.query: ${deptNames} \n`)
        // return deptNames
    })

    // console.log(`In queries.js outside db.query ${deptNames} \n`) 
    return deptNames
}

// displaying default menu
const initiateMenu = () => {
    inquirer
        .prompt({
            type:'list',
            name: 'selection',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department','Add a role','Add an employee','Update an employee role']
        })
        .then(initAction => {

            if (selection === 'View all departments') {
                dbQuery.viewDepartments()
            } else if (selection === 'View all roles') {
                dbQuery.viewRoles()
            } else if (selection === 'View all employees') {
                dbQuery.viewEmployees()
            } else if (selection === 'Add a department') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: 'What is the name of the department?'
                        }
                    ])
                .then(deptInfo => {
                    addDepartment(deptInfo)
                })
            } else if (initAction.selection === 'Add a role') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'What is the name of the role?'
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'What is the salary of the role?'
                        },
                        {
                            type: 'input',
                            name: 'department',
                            message: 'Which department (ID) does the role belong to?'
                        }
                    ])
                    .then(roleData => {
                        addRole(roleData)
                    })
            } else if(initAction.selection === 'Add an employee') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: "What is the employee's first name?"
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: "What is the employee's last name?"
                        },
                        {
                            type: 'input',
                            name: 'role',
                            message: 'What is the role of the employee?'
                        }
                    ])
                    .then(employeeInfo => {
                        addEmployee(employeeInfo)

                    })
            } else if (initAction.selection === 'Update an employee role') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'id',
                            message: 'Which employee (ID) do you want to update?'
                        },
                        {
                            type: 'input',
                            name: 'role_id',
                            message: 'Which role (ID) do you want to set?'
                        }
                    ])
                    .then (empRole => {
                        updateEmployeeRole(empRole)
                    })

            } else {
                process.exit()
            }
        })
    }
    
    // viewing all departments
    const viewDepartments = async() => {
        const sql = `SELECT * FROM department ORDER BY name `
    
        const deptArr = await db.query(sql)
        console.table(deptArr)
    
        initiateMenu()
    }
    
    // viewing all roles
    const viewRoles = async() => {
        const sql = `SELECT 
                        roles.id,
                        roles.title,
                        department.name AS department,
                        roles.salary
                    FROM roles
                    LEFT JOIN department
                    ON roles.department_id = department.id`
    
        const rolesArr = await db.query(sql)
        console.table(rolesArr)    
    
        initiateMenu()
    }
    
    // viewing all employees
    const viewEmployees = async() => {
        const sql = `SELECT
                        employee.id, 
                        employee.first_name, 
                        employee.last_name,
                        roles.title,
                        department.name AS department,
                        roles.salary
                     FROM employee
                     LEFT JOIN roles
                     ON employee.role_id = roles.id
                     LEFT JOIN department
                     ON roles.department_id = department.id
        `
    
        const empArr = await db.query(sql)
        console.table(empArr)
    
        initiateMenu()
    }
    
    //add department
    const addDepartment = async(input) => {
        const sql = `INSERT INTO department (name)
                        VALUES (?)
        `
        // Sample object data for development
        const dept = [ input.name ]
    
        await db.query(sql, input.name)
    
        console.log(`${input.name} added!`)
    
        initiateMenu()
    
    
    }
    
    // add role
    const addRole = async(role) => {
        const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?,?,?)`
        // Sample object data for dev
        const roleArr = [role.title,role.salary,role.department]
    
        await db.query(sql, roleArr)
    
        console.log(`Success!`)
    
        initiateMenu()
}

// adding employee
const addEmployee = async(employee) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id)
                VALUES (?,?,?)`
    const params = [ employee.firstName, employee.lastName, employee.role]

    await db.query(sql, params)

    console.log(`Success!`)

    initiateMenu()
}

// updating employee's role
const updateEmployeeRole = async(empRole) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
    const params = [empRole.role_id, empRole.id]

    await db.query(sql, params)

    console.log(`Success!`)

    initiateMenu()
}

initiateMenu()

module.exports = { initiateMenu }