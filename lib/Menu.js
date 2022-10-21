const inquirer = require('inquirer')
const db = require('../db/connection')
// const { viewRoles, viewDepartments } = require('./queries')
const cTable = require('console.table')


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

            if (initAction.selection === 'View all departments') {
                console.log('         ')
                viewDepartments()
            } else if (initAction.selection === 'View all roles') {
                console.log('         ')
                viewRoles()
            } else if (initAction.selection === 'View all employees') {
                console.log('         ')    
                viewEmployees()
            } else if (initAction.selection === 'Add a department') {
                console.log('       ')
                addDepartment()
            } else if (initAction.selection === 'Add a role') {
                console.log('      ')
                addRole()

            } else if(initAction.selection === 'Add an employee') {
                console.log('       ')
                addEmployee()
            } else if (initAction.selection === 'Update an employee role') {
                console.log('       ')
                updateEmployeeRole()
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
                    ON roles.department_id = department.id
                    ORDER BY title`
    
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
        await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the department?'
                }
            ])
        .then(deptInfo => {
            // Might be overkill, but mirroring the structure of other functions
            // Build and return params
            const params = [ deptInfo.name ]
            return params
        })
        .then(params => {
            const sql = `INSERT INTO department (name)
                         VALUES (?)
                         
            `
            db.query(sql, params)
            console.log(`${params} added`)

            initiateMenu()
        })
    
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
    // getting list of employee names and id as value for choices list
    const employees = await db.query(`SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee ORDER BY name`)
    const roles = await db.query(`SELECT title AS name, id AS value FROM roles ORDER BY name`)

    await inquirer
    .prompt([
        {
            type: 'list',
            name: 'id',
            message: "Which employee's role do you want to update?",
            choices: employees
        },
        {
            type: 'list',
            name: 'role_id',
            message: "What is the employee's new role?",
            choices: roles
        }
    ])
    .then(empRoleData => {
        // Build and return params
        const params = [empRoleData.role_id, empRoleData.id]
        return params

    })
    .then(params => {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
        db.query(sql, params)

        console.log(`Success`)

        initiateMenu()
    })
}

module.exports = { initiateMenu }