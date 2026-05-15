const Settings = require('../models/Settings');

// @desc    Get all settings
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.find();
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json(settingsMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update or create a setting
const updateSetting = async (req, res) => {
    const { key, value } = req.body;
    try {
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSettings,
    updateSetting
};
