const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = 5000;
const MONGO_URI =
  'mongodb+srv://admin:admin@cluster0.9gszt5n.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI);

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

app.get('/boards', async (req, res) => {
  const boards = await Board.find();
  res.json(boards);
});

app.post('/boards', async (req, res) => {
  const newBoard = new Board(req.body);
  await newBoard.save();
  res.json(newBoard);
});

app.put('/boards/:id', async (req, res) => {
  const updatedBoard = await Board.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedBoard);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
