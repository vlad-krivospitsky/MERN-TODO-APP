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

module.exports = mongoose.model('Board', boardSchema);
