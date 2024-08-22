const express = require('express');
const cors = require('cors');

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
  Employee.create(req.body)
    .then((employees) => res.json(employees))
    .catch((err) => res.json(err));
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res
      .status(500)
      .json({ error: 'Error registering user', details: error.message });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  Employee.findOne({ email, password }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json('success');
      } else {
        res.json('wrong password');
      }
    } else {
      res.json('No record existed');
    }
  });
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
