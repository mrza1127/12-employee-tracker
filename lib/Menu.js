const inquirer = require('inquirer')
const db = require('../db/connection')
// const { viewRoles, viewDepartments } = require('./queries')
const cTable = require('console.table')

// let depts = []

// const getDepartmentNames = async (data) => {
    // const sql = `SELECT department.name FROM department ORDER BY name`


//     const deptNames = await db.query(sql)
//     // for each value returned, push dept name as a string into an array for return

//     const deptsList = []
//     deptNames.forEach(item => {
//         deptsList.push(item.name)
//     })

//     depts = deptsList
// }

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

            addRole()


            } else if(initAction.selection === 'Add an employee') {
                addEmployee()

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
    const addRole = async() => {
        // getting list of depts for the list
        const depts = await db.query(`SELECT department.name FROM department ORDER BY name`)

        console.log(depts)
        await inquirer
                        .prompt([
                            {
                                type:'input',
                                name: 'title',
                                message: 'What is the name of the role?'
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'What is the salary of the role?'
                            },
                            {
                                type: 'list',
                                name: 'department',
                                message: 'Which department does the role belong to?',
                                choices: depts
                            }
                        ])
                        .then(roleData => {
                            // building and returning array from inquirer prompt
                            const roleArr = [roleData.title,roleData.salary,roleData.department]
    
                            return roleArr


                        })
                        .then(roleArr => {
                            // building sql query with array
                            const sql = `INSERT INTO roles (title, salary, department_id)
                                        VALUES (?,?)`
                            db.query(sql, roleArr)

                            // displaying initial menu once more
                            initiateMenu()
                        })

}

// adding employee
const addEmployee = async() => {
    // get the list of roles for the inquirer list
    const roles = await db.query(`SELECT roles.title AS name, roles.id AS value FROM roles ORDER BY name`)
    console.log(roles[1])
    await inquirer
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
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's role?",
                            choices: roles
                        }
                    ])
                    .then(empData => {
                        //Build and return params array we need
                        const params = [ empData.firstName, empData.lastName, empData.role]
                        return params
                    })
                    .then(params => {
                        const sql = `INSERT INTO employee (first_name, last_name, role_id)
                                        VALUES (?,?,?)`
                        db.query(sql, params)


                        console.log(`Success!`)

                    initiateMenu()
                })
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