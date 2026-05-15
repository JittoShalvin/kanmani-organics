const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Routes
app.use('/api', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/messages', messageRoutes);

// Seed Admin (Optional: can be moved to a script)
const Admin = require('./models/Admin');
const seedAdmin = async () => {
    try {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const adminExists = await Admin.findOne({ username });
        if (!adminExists) {
            await Admin.create({
                username: username,
                password: password,
                email: 'admin@kanmani.com',
                name: 'System Admin'
            });
            console.log(`Default admin created: ${username} / ${password}`);
        }
    } catch (err) {
        console.error("Error seeding admin:", err);
    }
};
seedAdmin();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
