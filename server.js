const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const consoleTable = require("console.table");

// Creates the connection information for the sql database
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "NewYork1991",
    database: "employees_db"
});

const query = util.promisify(connection.query).bind(connection);

// Runs the start function to prompt the user after the connection is made
connection.connect(function (err) {
    if (err) throw err;

    startOptions();
});

// Allows the user to select what they would like to do (add, view, update)
// MAYBE HAVE ADD, VIEW, UPDATE AS OPTIONS THAT THEN PRESENT OPTIONS FOR THAT TYPE?
function startOptions() {
    inquirer
        .prompt({
            name: "startOptions",
            type: "list",
            message: "Would you like to do?",
            choices: ["Add a department", "View all departments", "Add a role", "View all roles" , "Add an employee", "View all employees", "View employees by department", "View employees by manager", "Update an employee's role"]
        })
        .then(answer => {
            switch (answer.startOptions) {
                case "Add a department":
                    addDepartment();
                    break;
                case "View all departments":
                    viewDepartments();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "View employees by department":
                    viewEmployeesByDepartment();
                    break;
                case "View employees by manager":
                    viewEmployeesByManager();
                    break;
                case "Update an employee's role":
                    updateEmployee();
                    break;
                default:
                    break;
            };
        });
};

// Adds a department to the database
function addDepartment() {
    inquirer
        .prompt({
            name: "departmentName",
            type: "input",
            message: "What is the name of the department you would like to add?"
        })
        .then(answer => {
            connection.query("INSERT INTO department SET name = ?", [answer.departmentName],
                function (err) {
                    if (err) throw err;
                    console.log("The " + answer.departmentName + " department was successfully added.");
                    startOptions();
                }
            );
        });
};

// Displays a table with all departments
async function viewDepartments() {

    let allDepartments = await query("SELECT * FROM department");
    // REF: Learned how to make a "title" for the table by referencing the npm console.table docs
    console.table("All Departments", allDepartments);

    startOptions();
}

// Adds a role to the database
function addRole() {
    inquirer
        .prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the title of the role you would like to add?"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary for this role?"
            },
            {
                name: "roleDepartmentId",
                type: "input",
                message: "What is department ID number for this role?"
            }
        ])
        .then(answer => {
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: answer.roleDepartmentId
                },
                function (err) {
                    if (err) throw err;
                    console.log("The " + answer.roleTitle + " role with a salary of " + answer.roleSalary + " was successfully added.");
                    startOptions();
                }
            );
        });
};

// Displays a table with all roles
async function viewRoles() {

    let allRoles = await query("SELECT * FROM role");
    // REF: Learned how to make a "title" for the table by referencing the npm console.table docs
    console.table("All Roles", allRoles);

    startOptions();
}

// Adds an employee to the database
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "employeeFirstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "employeeLastName",
                type: "input",
                message: "What is the employee's last name?"
                // PROBABLY NEED TO INCLUDE ASSIGN/CONNECT role_id AND manager_id LATER
            }
        ])
        .then(answer => {
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.employeeFirstName,
                    last_name: answer.employeeLastName
                },
                function (err) {
                    if (err) throw err;
                    console.log("The " + answer.addDepartment + " department was successfully added.");
                    startOptions();
                }
            );
        });
};

// Displays a table with all employees; able to be sorted by department and by manager
async function viewEmployees() {

    let allEmployees = await query(`SELECT employee.id,employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM role INNER JOIN department ON department.id = role.department_id RIGHT JOIN employee ON role.id = employee.role_id LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    // REF: Learned how to make a "title" for the table by referencing the npm console.table docs
    console.table("All Employees", allEmployees);

    startOptions();
}

async function viewEmployeesByDepartment() {

    let allEmployeesByDepartment = await query(`SELECT employee.id,employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM role INNER JOIN department ON department.id = role.department_id RIGHT JOIN employee ON role.id = employee.role_id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY department.name`);
    console.table("Employees by Department", allEmployeesByDepartment);

    startOptions();
}

async function viewEmployeesByManager() {

    let allEmployeesByManager = await query(`SELECT employee.id,employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM role INNER JOIN department ON department.id = role.department_id RIGHT JOIN employee ON role.id = employee.role_id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY manager.last_name`);
    console.table("Employees by Manager", allEmployeesByManager);

    startOptions();
}

// Updates an employee's role
function updateEmployee() {
    inquirer
        .prompt([
            {
                name: "updateEmployeeId",
                type: "input",
                message: "What is the ID number of the employee?"
            },
            {
                name: "updateEmployeeRole",
                type: "input",
                message: "What is the role's ID number you'd like to assign to this employee?"
            },
        ])
        .then(answer => {
            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.updateEmployeeRole, answer.updateEmployeeId],
                function (err) {
                    if (err) throw err;
                    console.log("Employee " + answer.updateEmployeeId + "'s role has been updated!");
                    viewEmployees();
                    startOptions();
                }
            );
        });
}