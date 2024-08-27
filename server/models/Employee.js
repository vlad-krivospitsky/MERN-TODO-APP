const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model('Employee', employeeSchema);

