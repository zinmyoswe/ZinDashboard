import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single user
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create user
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, image } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            _id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            role: role || 0,
            department,
            image: image || ''
        });

        const savedUser = await user.save();
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { name, email, role, department, isActive, image } = req.body;

        const updateData = { name, email, role, department, isActive, image };

        // If password is provided, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            _id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            role: 0, // default role
            department
        });

        const savedUser = await user.save();
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role, department: user.department },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};