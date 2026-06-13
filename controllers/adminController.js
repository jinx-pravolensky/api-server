const User = require('../models/User');
const Match = require('../models/Match');

exports.getAllAccounts = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const users = await User.find({ createdBy: adminId })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { customId, name, email, password, role, phoneNumber, gender, createdBy } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email sudah digunakan!" });
    const newUser = await User.create({
      customId,
      name,
      email,
      password,
      role,
      phoneNumber,
      gender,
      createdBy
    });
    res.status(201).json({ message: "Akun Berhasil Dibuat!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat akun", error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Akun berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus akun", error: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { customId, name, email, phoneNumber, gender } = req.body;

    const emailCheck = await User.findOne({ email, _id: { $ne: id } });
    if (emailCheck) return res.status(400).json({ message: "Email sudah digunakan oleh akun lain!" });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { customId, name, email, phoneNumber, gender },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User tidak ditemukan" });

    res.status(200).json({ message: "Akun berhasil diperbarui!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui akun", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.searchJuri = async (req, res) => {
  try {
    const { customId } = req.params;
    const juri = await User.findOne({ customId: customId, role: 'juri' }).select('-password');

    if (!juri) {
      return res.status(404).json({ message: "Juri tidak ditemukan" });
    }

    res.status(200).json(juri);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.searchAdmin = async (req, res) => {
  try {
    const { customId } = req.params;
    const { matchId } = req.query;
    const admin = await User.findOne({ customId: customId, role: 'admin' }).select('-password');
    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan atau ID salah!" });
    }
    if (matchId) {
      const match = await Match.findById(matchId);
      if (match) {
        if (match.adminId.toString() === admin._id.toString()) {
          return res.status(400).json({ message: "❌ Ini adalah ID Pembuat Match! Tidak bisa dibagikan ke diri sendiri." });
        }
        if (match.sharedAdminIds.includes(admin._id.toString())) {
          return res.status(400).json({ message: "⚠️ Admin ini sudah memiliki akses ke Pertandingan ini!" });
        }
      }
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};