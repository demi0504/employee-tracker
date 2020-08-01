USE employee_db;
--Department table data
INSERT INTO department (department_id, department_name)
VALUES 
(1, "Sales"),
(2, "Engineering"),
(3, "Legal"),
(4, "Finance"),
(5, "Marketing");

--Roles table data
INSERT INTO role (role_id, title, salary, department_id)
VALUES 
(1, "Salesperson", 40000, 1),
(2, "Sales Lead", 55000, 1),
(3, "Software Engineer", 85000, 2),
(4, "Lead Engineer", 120000, 2),
(5, "Lawyer", 120000, 3),
(6, "Legal Manager", 140000, 3),
(7, "Accountant", 78000, 4),
(8, "Social Media Manager", 45000, 5);

--Employee table data
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES 
(1, "Stefani", "Germanotta", 4, NULL),
(2, "Louise", "Ciccone", 5, 3),
(3, "Ashley", "Frangipane", 6, NULL),
(4, "Melissa", "Elliot", 3, 1),
(5, "Adele", "Adkins", 2, NULL),
(6, "Dwayne", "Carter", 1, 2),
(7, "Demetria", "Lovato", 1, 2),
(8, "Ella", "OConnor", 7, NULL),
(9, "Britney", "Spears", 8, NULL);