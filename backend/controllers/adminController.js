const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Auth admin & get token
// @route   POST /api/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    const user = await Admin.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' }),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
    const user = await Admin.findById(req.userId).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
    const user = await Admin.findById(req.userId);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
    updateAdminProfile
};
