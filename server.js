require('dotenv').config();
const express = require('express');
const { initDb } = require('./data/database');
const contactsRouter = require('./routes/contacts');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
app.use('/contacts', contactsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

setupSwagger(app);


// Initialize database and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`GET    http://localhost:${PORT}/contacts`);
    console.log(`POST   http://localhost:${PORT}/contacts`);
    console.log(`GET    http://localhost:${PORT}/contacts/:id`);
    console.log(`PUT    http://localhost:${PORT}/contacts/:id`);
    console.log(`DELETE http://localhost:${PORT}/contacts/:id`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  const { closeDb } = require('./data/database');
  await closeDb();
  process.exit(0);
});