const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const loggedInMiddleware = require('../middlewares/auth.middleware.js');

const { hashPassword, matchPassword } = require('../utils/utils.js');

router.get('/profile', loggedInMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
});

router.put('/change-password', loggedInMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!matchPassword(oldPassword, user.password)) return res.status(401).json({ message: 'Invalid old password' });
  user.password = hashPassword(newPassword);
  await user.save();
  return res.status(200).json({ message: 'Password changed' });
});

router.put('/change-email', loggedInMiddleware, async (req, res) => {
  const { newEmail } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const existing = await User.findOne({ where: { email: newEmail } });
  if (existing) return res.status(400).json({ message: 'Email already in use' });
  user.email = newEmail;
  await user.save();
  return res.status(200).json({ message: 'Email changed' });
});

router.put('/change-name', loggedInMiddleware, async (req, res) => {
  const { newName } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.name = newName;
  await user.save();
  return res.status(200).json({ message: 'Name changed' });
});

router.delete('/delete-account', loggedInMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.destroy();
  return res.status(200).json({ message: 'Account deleted' });
});

module.exports = router;