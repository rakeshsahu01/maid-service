const express = require('express');
const router = express.Router();

// Mock services data
const services = [
    {
        id: 1,
        name: 'House Cleaning',
        description: 'Regular house cleaning including dusting, vacuuming, and bathroom cleaning',
        basePrice: 80,
        duration: 2,
        category: 'residential'
    },
    {
        id: 2,
        name: 'Deep Cleaning',
        description: 'Thorough deep cleaning including inside appliances and detailed work',
        basePrice: 150,
        duration: 4,
        category: 'residential'
    },
    {
        id: 3,
        name: 'Office Cleaning',
        description: 'Professional office space cleaning',
        basePrice: 100,
        duration: 3,
        category: 'commercial'
    },
    {
        id: 4,
        name: 'Move-in/Move-out Cleaning',
        description: 'Complete cleaning for moving situations',
        basePrice: 200,
        duration: 5,
        category: 'specialized'
    }
];

// Get all services
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: { services }
    });
});

// Get service by ID
router.get('/:id', (req, res) => {
    const service = services.find(s => s.id === parseInt(req.params.id));

    if (!service) {
        return res.status(404).json({
            success: false,
            message: 'Service not found'
        });
    }

    res.json({
        success: true,
        data: { service }
    });
});

module.exports = router;