const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Define the Vote model
const Vote = sequelize.define('Vote', {
  participant1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  participant2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Sync database and handle errors
sequelize.sync().catch(err => {
  console.error('Unable to connect to the database:', err);
});

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

let votes = { participant1: 0, participant2: 0 };

// Initialize votes from database
Vote.findByPk(1).then((data) => {
  if (data) {
    votes = data.dataValues;
  } else {
    Vote.create(votes).catch(err => console.error('Error creating initial votes:', err));
  }
}).catch(err => console.error('Error finding initial votes:', err));

// Socket.io connection
io.on('connection', (socket) => {
  socket.emit('voteUpdate', votes);
  socket.on('error', (err) => console.error('Socket error:', err));
});

// API to handle votes
app.post('/api/vote', (req, res) => {
  const { participant } = req.body;
  if (votes[participant] !== undefined) {
    votes[participant]++;
    Vote.upsert({ id: 1, ...votes }).then(() => {
      io.emit('voteUpdate', votes);
      res.sendStatus(200);
    }).catch(err => {
      console.error('Error updating votes:', err);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});

app.get('/api/votes', (req, res) => {
  res.json(votes);
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.sendStatus(500);
});

const PORT = process.env.PORT || 5001; // Change to 5001 or any other port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
