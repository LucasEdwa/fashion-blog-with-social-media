const express = require('express');
const app = express();
const port = 8000;
const fileUpload = require('express-fileupload');
const cors = require('cors');
const router = express.Router();

// Middleware
app.use(express.json());

// Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/current-user/user');
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use(cors());
app.use(fileUpload());
app.use(router);
// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, we could not find that!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});