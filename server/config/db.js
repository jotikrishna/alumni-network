const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const ensureAdminUser = require('../utils/seedAdmin');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000
        });

        console.log(`MongoDB Connected Successfully: ${mongoose.connection.host}`);

        // Ensure admin user exists in the database
        await ensureAdminUser();

    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
