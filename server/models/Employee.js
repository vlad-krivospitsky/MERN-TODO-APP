const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
