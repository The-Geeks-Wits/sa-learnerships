const User = require('./User.js');
const utils = require('../utils.js');

exports.register = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const email = req.body.email;
        const confirmPassword = req.body.confirmPassword;

        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(409).json({ error: 'User Already Exists!' });
        }

        if (firstName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
            return res.status(400).json({ error: 'Please Fill All The Required Fields!' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password length must be at least 8 characters long' });
        }

        if (!utils.isStrong(password)) {
            return res.status(400).json({
                error: 'Password is too weak. It must include at least one uppercase letter, one lowercase letter, one digit and one special symbol',
            });
        }

        const hashedPassword = await utils.hashPassword(password);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            signupMethod: 'manual',
        });

        const token = utils.generateAccessToken(email, user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isPasswordValid = await utils.comparePasswords(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const rememberMe = req.body.rememberMe;
        const token = utils.generateAccessToken(email, user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//deleting user from system...i suggest changing this to just blocking the user instead of deleting because we might need the data for future reference but for now i will just do delete
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findByIdAndUpdate(id, { status: 'disabled' }, { new: true });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({
                message: 'User disabled',
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                },
            });
        }

        res.json({ message: 'User disabled', user: user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

//update user role or status
exports.updateUser = async (req, res) => {
    try {
        const { role, status } = req.body;

        const allowedRoles = ['applicant', 'provider', 'admin'];
        const allowedStatus = ['active', 'inactive', 'blocked'];

        let updateData = {};

        if (role !== undefined) {
            const normalizedRole = role.toLowerCase().trim();

            if (!allowedRoles.includes(normalizedRole)) {
                return res.status(400).json({ message: 'Invalid role value' });
            }

            updateData.role = normalizedRole;
        }

        if (status !== undefined) {
            const normalizedStatus = status.toLowerCase().trim();

            if (!allowedStatus.includes(normalizedStatus)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }

            updateData.status = normalizedStatus;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all users also with search and filter
exports.getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;

        let query = {};

        if (role) {
            query.role = role.toLowerCase().trim();
        }

        if (search) {
            query.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        }

        const users = await User.find(query);

        for (let i = 0; i < users.length; i++) {
            delete users[i].password;
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get user by id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    if (req.user) return res.status(200).json({ user: req.user });
    return res.status(400).json({ error: 'User not found! Please check your token and try again later' });
};

exports.editProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ error: 'User required! Please provide the user of the profile' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Update fields required! Please provide some fields to update' });
        }

        // Build the update options and add personal details
        const updateOptions = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            gender: req.body.gender,
            dateOfBirth: new Date(req.body.dateOfBirth || req.user.dateOfBirth),
            location: req.body.location,
            phone: req.body.phone,
            qualifications: req.body.qualifications,
            skills: req.body.skills,
        };

        // Fields that are undefined will get ignored
        const user = await User.findByIdAndUpdate(req.user._id, updateOptions);

        // const newQualification = req.body.qualification || {};
        // const newSkills = req.body.skills || [];

        // newSkills.forEach((skill) => {
        //     const cleanSkill = skill.toLowerCase().trim();
        //     if (cleanSkill && !user.skills.includes(cleanSkill)) {
        //         user.skills.push(cleanSkill);
        //     }
        // });

        // const isValidQualification =
        //     newQualification &&
        //     newQualification.institution?.trim() &&
        //     newQualification.qualificationLevel?.trim() &&
        //     newQualification.qualificationName?.trim() &&
        //     newQualification.nqfLevel;

        // if (isValidQualification) {
        //     const exists = user.qualifications.some(
        //         (q) =>
        //             q.qualificationName === newQualification.qualificationName &&
        //             q.qualificationLevel === newQualification.qualificationLevel &&
        //             q.nqfLevel === newQualification.nqfLevel &&
        //             q.institution === newQualification.institution,
        //     );

        //     if (!exists) {
        //         user.qualifications.push(newQualification);
        //     }
        // }

        // user.firstName = req.body.firstName ?? user.firstName;
        // user.lastName = req.body.lastName ?? user.lastName;
        // user.phone = req.body.phone ?? user.phone;
        // user.location = req.body.location ?? user.location;
        // user.gender = req.body.gender ?? user.gender;
        // user.dateOfBirth = req.body.dateOfBirth ?? user.dateOfBirth;

        // Remove the password from the user details
        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({ user: userObj });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

///upload cv and save the file path to the backend.
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fs = require('fs');
        const path = require('path');

        const user = await User.findById(req.user.userId);

        if (user.cv) {
            const oldFilePath = path.join(process.cwd(), user.cv);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const filePath = `/uploads/${req.file.filename}`;

        user.cv = filePath;
        await user.save();

        res.json({
            success: true,
            cv: filePath,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed' });
    }
};
