const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let client;
let db;




const initDb = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env');
    
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false, // Set to true only for testing if needed
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    db = client.db(process.env.DB_NAME || 'professionalDB');
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

// ... rest of the file remains the same

const getDb = () => {
  if (!db) throw new Error('Database not initialized!');
  return db;
};

const closeDb = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  initDb,
  getDb,
  closeDb
};