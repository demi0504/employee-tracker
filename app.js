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

//Main menu options
const mainMenu = [
    {
        type: "list", 
        name: "firstChoice",
        message: "What would you like to do?",
        choices: [
            "Add Employee", 
            "Add Role", 
            "Add Department", 
            "View All Employees", 
            "View All Employees By Role", 
            "View All Employees By Department", 
            "View All Roles", 
            "View All Departments", 
            "Update An Employee Role", 
            "Exit",
        ],
    },
];

//render table data and menu prompt
function renderScreen(tableData){
    console.table(tableData);
    //menu prompt
    // init();
}

//Display main menu and then prompt next function based on selection
function init() {
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Make a selection:",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "View Roles", "View Departments", "Add Employee", "Add Roles", "Add Departments", "Remove Employee", "Remove Role", "Remove Department", "Update Employee Role", "Update Employee Manager", "View Total Utilized Budget By Department", "Exit"]
          })
        .then(answer => {
          switch(answer.promptChoice){
            case "View All Employees":
            queryEmployeesAll();
            break;

            case "View All Employees by Department":
            viewByDepartment();
            break;

            case "View All Employees by Manager":
            queryManagers();
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

            case "Remove Employee":
            removeEmployee();
            break;

            case "Remove Role":
            removeRole();
            break;

            case "Remove Department":
            removeDepartment();
            break;

            case "Update Employee Role":
            updateEmployeeRole();
            break;

            case "Update Employee Manager":
            updateEmployeeManager();
            break;

            case "View Total Utilized Budget By Department":
            viewTotalBudgetByDepartment();
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

//Manager prompt
function promptManagers (managers) {
  inquirer
      .prompt({
          type: "list",
          name: "promptChoice",
          message: "Select Manager: ", 
          choices: managers
      })
      .then(answer => {
        queryEmployeesByManager(answer.promptChoice);
      });
};

//query all employees
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
          init();
        });
    });
  });
}

//query all departments
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

//query roles and display
function viewRoles() {
  connection.query(`SELECT * FROM role`, function (err, data) {
    if (err) throw err;
    console.table(data);
    init();
  });
}

//query employees by department
function viewByDepartment(department) {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN employee AS manager ON employee.manager_id = manager.id
    INNER JOIN department ON department.id = role.department_id
    WHERE department.name = "${department}";
    `;
    connection.query(query, (err, res) => {
        if(err) throw err;
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({
                "ID": res[i].id, 
                "First Name": res[i].first_name,
                "Last Name": res[i].last_name,
                "Role": res[i].title,
                "Salary": res[i].salary, 
                "Manager": res[i].manager_full_name
            });
        };
        renderScreen(`${department} Department`, tableData);
    });
}

