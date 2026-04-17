const User = require('./User.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { isStrong } = require('../../scripts/common_functions.js');

function generateAccessToken(email, userId) {
    const secret = process.env.JWT_SECRET || 'your_secret_key_here';
    return jwt.sign({ email, userId }, secret, { expiresIn: '24h' });
}

async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return hashedPassword;
}

exports.register = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const email = req.body.email;
        const confirmPassword = req.body.confirmPassword;

        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(409).json({ error: 'User Already Exists!' });
        }

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()){
            return res.status(400).json({error: "Please Fill All TThe Required Fields"});
        }

        if (password != confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password length must be at least 8 characters long' });
        }

        if (!isStrong(password)) {
            return res.status(400).json({
                error: 'Password is too weak. It must include at least one uppercase letter, one lowercase letter, one digit and one special symbol',
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            signupMethod: 'manual',
        });

        const token = generateAccessToken(email, user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, //we have to change to true after production/deployment
            sameSite: 'Lax',
            maxAge: 3600000,
        });

        res.status(201).json({
            success: true,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
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

        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isPasswordValid = await bcryptjs.compare(password, userExists.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        const rememberMe = req.body.rememberMe;
        const token = generateAccessToken(email, userExists._id);

        let maxAge;
        if (rememberMe) {
            maxAge = 604800000;
        } else {
            maxAge = 3600000;
        }


        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, //we have to change to true after production/deployment
            maxAge: maxAge,
            sameSite: 'Lax',
             domain: 'localhost'
        });

        res.status(201).json({
            success: true,
            user: {
                id: userExists._id,
                firstName: userExists.firstName,
                lastName: userExists.lastName,
                email: userExists.email,
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

        const user = await User.findByIdAndUpdate(
            id,
            {
                status: 'disabled',
            },
            { new: true },
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'User disabled', user: user });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

//update user role or status
exports.updateUser = async (req, res) => {
    try {
        const { role, status } = req.body;
        //arrays of roles and statuses
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
        }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all users also with  search and filter
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

        const users = await User.find(query).select('-password');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get  user by id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });

        }
        return res.json({ user: user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.saveProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        const newQualification = req.body.qualification || {};
        const newSkills = req.body.skills || [];

        newSkills.forEach(rawskill => {
            
            skill = rawskill.toLowerCase().trim();
            if (skill && !user.skills.includes(skill)) {
                user.skills.push(skill);
            }
        });

        const isValidQualification =
            newQualification &&
            newQualification.institution?.trim() &&
            newQualification.qualificationLevel?.trim() &&
            newQualification.qualificationName?.trim() &&
            newQualification.nqfLevel;

        let qualificationExists = false;
        if (isValidQualification) {
            const exists = user.qualifications.some(q =>
                q.qualificationName === newQualification.qualificationName &&
                q.qualificationLevel === newQualification.qualificationLevel &&
                q.nqfLevel === newQualification.nqfLevel &&
                q.institution === newQualification.institution
            );

            if (!exists) {
                user.qualifications.push(newQualification);
            }
            else{
                qualificationExists = true;
            }
        }
        

        if (req.body.firstName){
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName){
             user.lastName = req.body.lastName;
        }

        if (req.body.phone){
             user.phone = req.body.phone;
        }
        if (req.body.location){
             user.location = req.body.location;
        }
        if (req.body.gender){
             user.gender = req.body.gender;
        }
        if (req.body.dateOfBirth){
             user.dateOfBirth = req.body.dateOfBirth;
        }
    

        await user.save();
        return res.status(200).json({
            success: true,
            message: qualificationExists
            ? "Profile updated, but qualification already exists"
            : "Profile updated successfully",
            user
        });
        

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

///upload cv and save the file path to the backend.
exports.uploadCV = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //handling error if no file is uploaded.
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;

        //saving the file path to the user's cv field in the database.
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cv: filePath },
            { new: true }
        );

        //success response.
        res.json({
            success: true,
            message: "CV uploaded successfully",
            cv: updatedUser.cv
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
