const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// In-memory store for demo (replace with MongoDB in production)
let bookings = [];
let nextBookingId = 1;

/**
 * Shape of a booking (in-memory):
 * {
 *   id: number,
 *   customerId: string,
 *   maidId: string,
 *   service: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:mm),
 *   address: string,
 *   amount: number,
 *   specialInstructions?: string,
 *   status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'declined' | 'cancelled',
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

// Create new booking (customer creates request for a maid)
router.post('/', auth, (req, res) => {
  try {
    // Only customers create bookings
    // If allowing admins, adjust here
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Only customers can create bookings' });
    }

    const {
      maidId,
      service,
      date,
      time,
      address,
      amount,
      specialInstructions
    } = req.body;

    if (!maidId) {
      return res.status(400).json({ success: false, message: 'maidId is required' });
    }
    if (!service || !date || !time || !address) {
      return res.status(400).json({ success: false, message: 'service, date, time, and address are required' });
    }

    const booking = {
      id: nextBookingId++,
      customerId: req.user.id,
      maidId,
      service,
      date,
      time,
      address,
      amount: Number(amount) || 0,
      specialInstructions: specialInstructions || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    bookings.push(booking);

    return res.status(201).json({ success: true, data: { booking } });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get bookings for the logged-in user
router.get('/', auth, (req, res) => {
  try {
    let userBookings;
    if (req.user.role === 'customer') {
      userBookings = bookings.filter(b => b.customerId === req.user.id);
    } else if (req.user.role === 'maid') {
      userBookings = bookings.filter(b => b.maidId === req.user.id);
    } else {
      userBookings = [];
    }

    return res.json({ success: true, data: { bookings: userBookings } });
  } catch (error) {
    console.error('List bookings error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single booking by id (optional helper)
router.get('/:id', auth, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const booking = bookings.find(b => b.id === id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only the customer or assigned maid can view
    if (booking.customerId !== req.user.id && booking.maidId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    return res.json({ success: true, data: { booking } });
  } catch (e) {
    console.error('Get booking error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update booking status (maid or customer where allowed)
router.put('/:id/status', auth, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body; // 'confirmed' | 'in_progress' | 'completed' | 'declined' | 'cancelled'
    const allowed = ['pending', 'confirmed', 'in_progress', 'completed', 'declined', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });

    const booking = bookings[idx];

    // Authorization and transitions
    if (req.user.role === 'maid') {
      if (booking.maidId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      // Maid transitions:
      // pending -> confirmed / declined
      // confirmed -> in_progress
      // in_progress -> completed
      const from = booking.status;
      const allowedTransitions = {
        pending: ['confirmed', 'declined'],
        confirmed: ['in_progress'],
        in_progress: ['completed'],
        completed: [],
        declined: [],
        cancelled: []
      };
      if (!allowedTransitions[from]?.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid transition from ${from} to ${status}` });
      }
    } else if (req.user.role === 'customer') {
      if (booking.customerId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      // Customer transitions: pending -> cancelled
      if (!(booking.status === 'pending' && status === 'cancelled')) {
        return res.status(403).json({ success: false, message: 'Customer cannot set this status' });
      }
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    booking.status = status;
    booking.updatedAt = new Date();

    return res.json({ success: true, data: { booking } });
  } catch (e) {
    console.error('Update status error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Stats for current user
router.get('/stats', auth, (req, res) => {
  try {
    let userBookings;
    if (req.user.role === 'maid') {
      userBookings = bookings.filter(b => b.maidId === req.user.id);
    } else if (req.user.role === 'customer') {
      userBookings = bookings.filter(b => b.customerId === req.user.id);
    } else {
      userBookings = [];
    }

    const total = userBookings.length;
    const completed = userBookings.filter(b => b.status === 'completed').length;
    const pending = userBookings.filter(b => b.status === 'pending').length;
    const totalSpent = (req.user.role === 'customer')
      ? userBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
      : 0;

    return res.json({
      success: true,
      data: { total, completed, pending, totalSpent }
    });
  } catch (e) {
    console.error('Stats error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;