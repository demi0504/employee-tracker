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
    clear();
    console.table(tableData);
    //menu prompt
    init();
}

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
                queryEmployeesAll();
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
    // getDepts();
    // getRoles();
    // getManagers();
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
  SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
  FROM employee
  LEFT JOIN role ON employee.role_id = role_id
  LEFT JOIN department ON department.department_id = role.department_id
    LEFT JOIN employee as manager ON employee.manager_id = manager.id;`
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
        "Department": res[i].department_name,
        "Manager": res[i].manager_full_name
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