const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all maids (for customers to browse)
router.get('/maids', async (req, res) => {
    try {
        const maids = await User.find({ role: 'maid', isActive: true })
            .select('-password')
            .sort({ 'profile.rating.average': -1 });

        res.json({
            success: true,
            data: { maids }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;