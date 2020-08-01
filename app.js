const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
//department, role, employee, manager arrays to be filled when added too and updated
let deptArr = [];
let roleArr = [];
let emplArr = [];
let managerArr = [];

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db"
});

//Connect to mysql server and employee database
connection.connect((err) => {
  if (err) throw err;
  console.log('EMPLOYEE TRACKER');
  //Once connection is made, prompt user with main menu options
  init();
});

//Display main menu and then prompt next function based on selection
function init() {
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Make a selection:",
            choices: ["View All Employees", "View Roles", "View Departments", "Add Employee", "Add Roles", "Add Departments", "Update Employee Role", "Exit"]
          })
        .then(answer => {
          switch(answer.promptChoice){
            case "View All Employees":
            queryEmployeesAll();
            break;

            case "View Roles":
            viewRoles();
            break;

            case "View Departments":
            viewDepartments();
            break;

            case "Add Employee":
            addEmployee();
            break;

            case "Add Roles":
            addRole();
            break;

            case "Add Departments":
            addDepartment();
            break;

            case "Update Employee Role":
            updateEmployee();
            break;

            case "Exit":
            connection.end();
        };
    });
    //update arrays each time init function is called
    getDepts();
    getRoles();
    getManagers();
};

// Get all departments
function getDepts() {
  connection.query(`SELECT department_name FROM department`, function (
    err,
    departments
  ) {
    if (err) throw err;
    deptArr = [];
    for (i = 0; i < departments.length; i++) {
      deptArr.push(departments[i].department_name);
    }
    // console.log(deptArr);
  });
}

// Get all roles
function getRoles() {
  connection.query(`SELECT title FROM role`, function (err, roles) {
    if (err) throw err;
    roleArr = [];
    for (i = 0; i < roles.length; i++) {
      roleArr.push(roles[i].title);
    }
    // console.log(roleArr);
  });
}

// Get all potential managers by last name
function getManagers() {
  connection.query(`SELECT employee.last_name FROM employee`, function (
    err,
    managers
  ) {
    if (err) throw err;
    emplArr = [];
    for (i = 0; i < managers.length; i++) {
      managerArr.push(managers[i].last_name);
    }
    // console.log(managerArr);
  });
}

//view all employees
function queryEmployeesAll(){
  //sql query
  connection.query(
    `
    SELECT employee.employee_id, employee.first_name, employee.last_name, role.title,
    department.department_name AS department,role.salary,CONCAT(a.first_name, " ", a.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id
    LEFT JOIN employee a ON a.employee_id = employee.manager_id;`,
      function (err, data) {
        if (err) throw err;
        console.table(data);
        init();
      }
  );
}

//view all departments
function viewDepartments() {
  const query = `SELECT department.department_name FROM department`;
  connection.query(query, (err, res) => {
      if(err) throw err;
      //push dept names to array
      const departments = [];
      for (let i = 0; i < res.length; i++) {
          departments.push(res[i].department_name);
      }
      //prompt for dept selection
      console.table(departments);
      init();
  });
};

//view all roles
function viewRoles() {
connection.query(`SELECT * FROM role`, function (err, data) {
  if (err) throw err;
  console.table(data);
  init();
});
}

//add departments
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is your department name?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.department,
        },
        function (err) {
          if (err) throw err;
        }
      );
      console.log("Department Added!");
      init();
    });
}

//add employee
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    connection.query("SELECT * FROM employee", function (err, res2) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "roleName",
            type: "list",
            message: "What is the employee's role?",
            choices: roleArr,
          },
          {
            name: "managerName",
            type: "list",
            message: "Who is this employee's Manager?",
            choices: managerArr,
          },
        ])
        .then(function (answer) {
          let roleID;
          for (let r = 0; r < res.length; r++) {
            if (res[r].title == answer.roleName) {
              roleID = res[r].role_id;
            }
          }
          let managerID;
          for (let m = 0; m < res2.length; m++) {
            if (res2[m].last_name == answer.managerName) {
              managerID = res2[m].employee_id;
            }
          }
          // when finished prompting, insert a new item into the db with that info
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: roleID,
              manager_id: managerID,
            },
            function (err) {
              if (err) throw err;
            }
          );
          console.log("Employee Added!");
          init();
        });
    });
  });
}

//add roles
function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is your role title?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
          default: "0.00",
        },
        {
          name: "departmentName",
          type: "list",
          message: "What is your department is this role in?",
          choices: deptArr,
        },
      ])
      .then(function (answer) {
        // set corresponding department ID to variable
        let deptID;
        for (let d = 0; d < res.length; d++) {
          if (res[d].department_name == answer.departmentName) {
            deptID = res[d].department_id;
          }
        }
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: deptID,
          },
          function (err) {
            if (err) throw err;
          }
        );
        console.log("Role Added!");
        init();
      });
  });
}


//update employee
// Update an employee
function updateEmployee() {
  connection.query(
    `SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee`,
    function (err, employees) {
      if (err) throw err;
      emplArr = [];
      for (i = 0; i < employees.length; i++) {
        emplArr.push(employees[i].Name);
      }
      connection.query("SELECT * FROM role", function (err, res2) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "employeeChoice",
              type: "list",
              message: "Which employee would you like to update?",
              choices: emplArr,
            },
            {
              name: "roleChoice",
              type: "list",
              message: "What is the employee's new role?",
              choices: roleArr,
            },
          ])
          .then(function (answer) {
            let roleID;
            for (let r = 0; r < res2.length; r++) {
              if (res2[r].title == answer.roleChoice) {
                roleID = res2[r].role_id;
              }
            }
            // when finished prompting, update the db with that info
            connection.query(
              `UPDATE employee SET role_id = ? WHERE employee_id = (SELECT employee_id FROM(SELECT employee_id FROM employee WHERE CONCAT(first_name," ",last_name) = ?)AS NAME)`,
              [roleID, answer.employeeChoice],
              function (err) {
                if (err) throw err;
              }
            );
            init();
          });
      });
    }
  );
}

