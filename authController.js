import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password min 6 chars' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username taken' });
    const user = new User({ username, password });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const forgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) return res.status(400).json({ message: 'Missing fields' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password min 6 chars' });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
