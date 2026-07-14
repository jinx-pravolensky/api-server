const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email sudah terdaftar!" });
    const user = await User.create({
      name,
      email,
      password,
      role: 'viewer'
    });
    res.status(201).json({ message: "Akun berhasil dibuat!", user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email tidak ditemukan!" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah!" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      message: "Login Berhasil",
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "not_found" });
    }
    res.status(200).json({ message: "active" });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Akun tidak ditemukan!" });
    }
    res.status(200).json({ message: "Akun berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};