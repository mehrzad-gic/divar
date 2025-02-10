const express = require('express');
const HomeRoutes = express();

/**  
 * @swagger  
 * /auth/register:  
 *   post:  
 *     summary: Register a new user  
 *     description: This endpoint allows a new user to register.  
 *     tags:  
 *       - auth  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 example: user123  
 *               password:  
 *                 type: string  
 *                 example: pass@123  
 *               email:  
 *                 type: string  
 *                 example: user@example.com  
 *     responses:  
 *       200:  
 *         description: User registered successfully.  
 *       400:  
 *         description: Invalid user input.  
 */  
HomeRoutes.post('/auth/register', (req, res) => {  
    res.send({ message: 'User registered successfully.' });  
});  


/**  
 * @swagger  
 * /auth/login:  
 *   post:  
 *     summary: Log in an existing user  
 *     description: This endpoint allows a user to log in.  
 *     tags:  
 *       - auth  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 example: user123  
 *               password:  
 *                 type: string  
 *                 example: pass@123  
 *     responses:  
 *       200:  
 *         description: User logged in successfully.  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 token:  
 *                   type: string  
 *                   example: "eyJhbGci..."  
 *       401:  
 *         description: Invalid credentials.  
 */  
HomeRoutes.post('/auth/login', (req, res) => {  
    res.send({ message: 'User logged in successfully.', token: 'eyJhbGci...' });  
});  


/**  
 * @swagger  
 * /auth/forget-password:  
 *   post:  
 *     summary: Request a password reset  
 *     description: This endpoint allows a user to request a password reset.  
 *     tags:  
 *       - auth  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               email:  
 *                 type: string  
 *                 example: user@example.com  
 *     responses:  
 *       200:  
 *         description: Password reset email sent successfully.  
 *       400:  
 *         description: Invalid email address.  
 */  
HomeRoutes.post('/auth/forget-password', (req, res) => {  
    res.send({ message: 'Password reset email sent successfully.' });  
});

module.exports = HomeRoutes;