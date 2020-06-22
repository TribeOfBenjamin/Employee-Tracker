DROP DATABASE IF EXISTS employees_db;

-- Create the database day_planner_db and specified it for use.
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
	id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(8,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Test Seed
INSERT INTO department (name) VALUES ("build");
INSERT INTO role (title, salary) VALUES ("engineer", 70000);
INSERT INTO employee (first_name, last_name) VALUES ("Ben", "Vasko");

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

	
