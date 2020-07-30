const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");

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

//Display main menu and then prompt next function based on selection
function init() {
    inquirer.prompt(mainMenu).then((response) => {
        switch (response.firstChoice) {
            case "Add Employee":
                employee();
                break;
            case "Add Role":
                role();
                break;
            case "Add Department":
                department();
                break;
            case "View All Employees":
                viewEmployees();
                break;
            case "View All Employees By Role":
                viewByRole();
                break;
            case "View All Employees By Department":
                viewByDepartment();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "View All Departments":
                viewDepartments();
                break;
            case "Update An Employee Role":
                updateEmployee();
                break;
            case "Exit":
                connection.end();
                break;
            default:
                connection.end();  
        };
    });
    getDepts();
    getRoles();
    getManagers();
};
