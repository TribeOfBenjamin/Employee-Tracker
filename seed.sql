USE employees_db;

INSERT INTO department (name) VALUES ("Sales"), ("Development"), ("Human Resources");
INSERT INTO role (title, salary, department_id) VALUES ("Sales Intern", 30000, 1), ("Sales Lead", 90000, 1), ("Junior Dev", 50000, 2), ("Tech Lead", 80000, 2), ("HR Assistant", 45000, 3), ("HR Lead", 65000, 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Brad", "Pit", 2), ("George", "Cloney", 4), ("Karen", "Johnson", 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Leo", "DiCapri", 1, 2), ("Tom", "Hank", 3, 4), ("Anthony", "Hopkin", 5, 6);