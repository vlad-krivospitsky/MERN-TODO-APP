// const mongoose = require('mongoose');

// const EmployeeSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// const EmployeeModel = mongoose.model('employees', EmployeeSchema);

// module.exports = EmployeeModel;

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
