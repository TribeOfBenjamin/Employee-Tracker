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
            choices: ["Add a department", "Add a role", "Add an employee", "View all employees", "View employees by department", "View employees by manager", "Update an employee's role"]
        })
        .then(answer => {
            switch (answer.startOptions) {
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
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
            }
        ])
        .then(answer => {
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.roleTitle,
                    salary: answer.roleSalary
                },
                function (err) {
                    if (err) throw err;
                    console.log("The " + answer.roleTitle + " role with a salary of " + answer.roleSalary + " was successfully added.");
                    startOptions();
                }
            );
        });
};

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

    let allEmployees = await query("SELECT employee.id, first_name, last_name, name AS department, title, salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id");
    // REF: Learned how to make a "title" for the table by referencing the npm console.table docs
    console.table("All Employees", allEmployees);

    startOptions();
}

async function viewEmployeesByDepartment() {

    // NOT ORDERED BY DEPARTMENT YET (BY FIRST NAME)
    let allEmployeesByDepartment = await query("SELECT employee.id, first_name, last_name, name AS department, title, salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY name");
    console.table("Employees by Department", allEmployeesByDepartment);

    startOptions();
}

async function viewEmployeesByManager() {

    // NOT ORDERED BY MANAGER YET (BY FIRST NAME)
    let allEmployeesByManager = await query("SELECT * FROM employee ORDER BY first_name");
    console.table("Employees by Manager", allEmployeesByManager);

    startOptions();
}

// Updates an employee's role
function updateEmployee() {
    inquirer
        .prompt([
            {
                name: "updateEmployeeFirstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "updateEmployeeLastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "updateEmployeeTitle",
                type: "input",
                message: "What is the title of the new role?"
            },
            {
                name: "updateEmployeeSalary",
                type: "input",
                message: "What is the salary of the new role?"
            }
        ])
        .then(answer => {
            connection.query("UPDATE role SET title = ?, salary = ? WHERE first_name IN",
                {
                    title: answer.updateEmployeeTitle,
                    salary: answer.updateEmployeeSalary,
                    first_name: answer.updateEmployeeFirstName
                },
                function (err) {
                    if (err) throw err;
                    console.log("SUCCESS!");
                    startOptions();
                }
            );
        });
}

// UPDATE role SET title = ?, salary = ? WHERE first_name IN (SELECT first_name FROM employee = ?) AND last_name IN (SELECT last_name FROM employee WHERE first_name = ?)

// UPDATE role SET title = ?, salary = ? WHERE first_name IN employee = ?
