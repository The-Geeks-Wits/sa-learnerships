const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../authorization/User.js');

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@salearnerships.co.za' });
        if (existingAdmin) {
            console.log('Admin already exists, skipping...');
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin@1234', 10);

        await User.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@salearnerships.co.za',
            password: hashedPassword,
            role: 'admin',
            signupMethod: 'manual',
            status: 'active',
        });

        console.log('Admin created successfully!');
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;