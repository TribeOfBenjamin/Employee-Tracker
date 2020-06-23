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
            choices: ["Add a department", "Add a role", "Add an employee", "View all employees", "View employees by department", "View employees by manager"]
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


async function viewEmployees() {

    let allEmployees = await query("SELECT * FROM employee FULL OUTER JOIN role ON role.id = employee.role_id");
    // REF: Learned how to make a "title" for the table by referencing the npm console.table docs
    console.table("All Employees", allEmployees);
}

async function viewEmployeesByDepartment() {

    // NOT ORDERED BY DEPARTMENT YET (BY FIRST NAME)
    let allEmployeesByDepartment = await query("SELECT * FROM employee ORDER BY first_name");
    console.table("Employees by Department", allEmployeesByDepartment);
}

async function viewEmployeesByManager() {

    // NOT ORDERED BY MANAGER YET (BY FIRST NAME)
    let allEmployeesByManager = await query("SELECT * FROM employee ORDER BY first_name");
    console.table("Employees by Manager", allEmployeesByManager);
}