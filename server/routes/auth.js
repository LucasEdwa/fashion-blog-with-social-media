const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('./middlewares');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

const prisma = new PrismaClient();
const schema = new passwordValidator();

//  Authentification

router.post('/sign-up', async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body;

    // Check for missing fields
    if (!email || !password || !username ) {
        return res.status(400).json({ error: 'Missing some of the required fields' });
    }

    // Validate email
    const emailValid = emailValidator.validate(email);
    if (!emailValid) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().uppercase() // Must have uppercase letters
        .has().lowercase() // Must have lowercase letters
        .has().digits() // Must have digits
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    // Validate password

    const passwordValid = schema.validate(password);
    if (!passwordValid) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    // Validate full name
    if (username.length < 3) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    // validate username
    const usernameValid = await prisma.user.findUnique({
        where: { username: username }
    });

    if (usernameValid) {
        return res.status(400).json({ error: 'username already exists' });
    }

 
    // Check if email already exists
    const emailExists = await prisma.user.findUnique({
        where: { email: email }
    });

    if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                username: username,
                firstName: firstName,
                lastName: lastName,

            }
        });
        res.json({ message: 'User created successfully, email: ' + user.email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Unable to create user' });
    }
});
router.post('/sign-in', async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !password|| !username) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email, username }  
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found with provided email.' });
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }
        const tokenPayload = { userId: user.id }; // Ensure 'role' is included if you use it for authorization checks
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password: _, ...userData } = user; // Exclude password from the user data
        res.json({
            token,
            user: userData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred during the sign-in process.' });
    }
});

router.post('/sign-out', (req, res) => {
    // ## destroy token on client side
    res.json({ message: 'Sign out successful' });
});


// Endpoint to edit user data
router.put('/edit-user', verifyToken, async (req, res) => {
    const { email, firstName, lastName, username, password } = req.body;

    // Validate email if provided
    if (email && !emailValidator.validate(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    // Validate password if provided
    if (password && !schema.validate(password)) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    // Validate username if provided
    if (username && username.length < 3) {
        return res.status(400).json({ error: 'Invalid username' });
    }

    try {
        const updateData = {};
        if (email) updateData.email = email;
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (username) updateData.username = username;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: updateData
        });

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Unable to update user' });
    }
});

module.exports = router;
module.exports = router;