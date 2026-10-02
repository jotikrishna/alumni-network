const mongoose = require('mongoose');
const ensureAdminUser = require('../utils/seedAdmin');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alumni_connect';

  try {
    // Attempt standard MongoDB connection with short serverSelectionTimeoutMS
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Initializing MongoMemoryServer fallback...`);
    try {
      const path = require('path');
      const fs = require('fs');
      const { MongoMemoryServer } = require('mongodb-memory-server');

      const dbDir = path.join(__dirname, '../.data/db');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      try {
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: {
            dbPath: dbDir,
            storageEngine: 'wiredTiger'
          }
        });
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`Persistent Mongo Database Connected: ${memoryUri}`);
      } catch (lockErr) {
        mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`In-Memory MongoDB Started & Connected: ${memoryUri}`);
      }
    } catch (memErr) {
      console.error('Failed to start MongoMemoryServer fallback:', memErr.message);
      process.exit(1);
    }
  }

  // Ensure admin user exists in DB
  await ensureAdminUser();
};

module.exports = connectDB;
