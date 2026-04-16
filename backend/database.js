const mongoose = require('mongoose');

async function connectDatabase() {
    try {
        const url = process.env.DB_URI;
        await mongoose.connect(url);
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); // Stop the server
    }
}

module.exports = connectDatabase;
