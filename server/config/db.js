const mongoose = require('mongoose');
const MONGO_URI =
  'mongodb+srv://admin:admin@cluster0.9gszt5n.mongodb.net/todo-app';
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
