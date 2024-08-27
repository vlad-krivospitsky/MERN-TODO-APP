const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee');
const User = require('./models/User');
const Board = require('./models/Board');
const connectDB = require('./config/db');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

connectDB();

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!passwordValidationRegex.test(password)) {
  return res.status(400).json({
    error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.'
  });
}
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password cannot be empty' });
  }

  Employee.findOne({ email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.status(200).json({ message: 'success' });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      res.status(400).json({ message: 'No record existed' });
    }
  });
});

app.get('/boards', async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Error fetching boards' });
  }
});

app.post('/boards', async (req, res) => {
  try {
    const newBoard = new Board(req.body);
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Error creating board' });
  }
});

app.put('/boards/:id', async (req, res) => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBoard)
      return res.status(404).json({ error: 'Board not found' });
    res.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Error updating board' });
  }
});
app.delete('/boards/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    await Board.findByIdAndDelete(boardId);
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ message: 'Failed to delete board' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const routes = require('./routes/routes');

// const app = express();
// const PORT = 5000;

// app.use(express.json());
// app.use(cors());

// connectDB();

// app.use('/', routes);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
