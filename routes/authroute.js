
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
	const { email, password } = req.body;
	
	// Validation
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}
	
	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ message: 'Please enter a valid email address' });
	}
	
	if (password.length < 6) {
		return res.status(400).json({ message: 'Password must be at least 6 characters long' });
	}
	
	try {
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists with this email' });
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ email: email.toLowerCase(), password: hashedPassword });
		await user.save();
		
		// Generate token for immediate login after signup
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		
		res.status(201).json({ 
			message: 'User created successfully',
			token,
			user: {
				id: user._id,
				email: user.email
			}
		});
	} catch (err) {
		console.error('Signup error:', err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	
	// Validation
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}
	
	try {
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		
		res.json({ 
			token,
			user: {
				id: user._id,
				email: user.email
			}
		});
	} catch (err) {
		console.error('Login error:', err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Verify token route
router.get('/verify', async (req, res) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		
		if (!token) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select('-password');
		
		if (!user) {
			return res.status(401).json({ message: 'Invalid token' });
		}

		res.json({ 
			user: {
				id: user._id,
				email: user.email
			}
		});
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' });
	}
});

module.exports = router;

