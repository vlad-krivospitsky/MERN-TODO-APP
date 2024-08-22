const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: String,
  items: [
    {
      id: Number,
      title: String,
    },
  ],
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
