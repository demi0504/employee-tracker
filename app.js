const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
};

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
  const query = `
  SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name
  FROM employee
  LEFT JOIN role ON employee.role_id = role.role_id
  LEFT JOIN department ON department.department_id = role.department_id;`
  connection.query(query, (err, res) => {
    if (err) throw err;
    const tableData = [];
    for (let i = 0; i < res.length; i++) {
      tableData.push({
        "ID": res[i].id,
        "First Name": res[i].first_name,
        "Last Name": res[i].last_name, 
        "Role": res[i].title,
        "Salary": res[i].salary, 
        "Department": res[i].salary, 
        "Department": res[i].department_name
      });
    }
    renderScreen("All Employees", tableData);
  });
};

//query all departments
function viewDepartments() {
    const query = `SELECT department.name FROM department`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        //push dept names to array
        const departments = [];
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }
        //prompt for dept selection
        promptDepartments(departments);
    });
};

function queryDepartmentsCallBack(callback){
    const query = `SELECT department.name FROM department;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract department names to array
        const departments = [];
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }
        //prompt for department selection
       callback(departments)
    });
}

//query roles and display
function viewRoles() {
    const query = `SELECT id, title FROM employee_db.role;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        const tableData = [];
        for(let i = 0; i < res.length; i++) {
            tableData.push({
                "ID": res[i].id,
                "Roles": res[i].title
            });
        }
        renderScreen("All Roles", tableData);
    });
}

//query all managers
// function 
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

//