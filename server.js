const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "NewYork1991",
    database: "employees_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    startOptions();
});

// function which prompts the user for what action they should take
function startOptions() {
    inquirer
        .prompt({
            name: "startOptions",
            type: "list",
            message: "Would you like to do?",
            choices: ["Add a department", "Add a role", "Add an employee"]
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
                default:
                    break;
            };
        });
};

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

