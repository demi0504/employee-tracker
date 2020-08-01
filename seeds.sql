USE employee_db;
--Department table data
INSERT INTO department (department_id, department_name)
VALUES (1, "Sales");

INSERT INTO department (department_id, department_name)
VALUES (2, "Engineering");

INSERT INTO department (department_id, department_name)
VALUES (3, "Legal");

INSERT INTO department (department_id, department_name)
VALUES (4, "Finance");

INSERT INTO department (department_id, department_name)
VALUES (5, "Marketing");

--Roles table data
INSERT INTO role (role_id, title, salary, department_id)
VALUES (1, "Salesperson", 40000, 1);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (2, "Sales Lead", 55000, 1);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (3, "Software Engineer", 85000, 2);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (4, "Lead Engineer", 120000, 2);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (5, "Lawyer", 120000, 3);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (6, "Legal Manager", 140000, 3);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (7, "Accountant", 78000, 4);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (8, "Social Media Manager", 45000, 5);

--Employee table data
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (1, "Stefani", "Germanotta", 4, NULL);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (2, "Louise", "Ciccone", 5, 3);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (3, "Ashley", "Frangipane", 6, NULL);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (4, "Melissa", "Elliot", 3, 1);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (5, "Adele", "Adkins", 2, NULL);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (6, "Dwayne", "Carter", 1, 2);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (7, "Demetria", "Lovato", 1, 2);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (8, "Ella", "OConnor", 7, NULL);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (9, "Britney", "Spears", 8, NULL);