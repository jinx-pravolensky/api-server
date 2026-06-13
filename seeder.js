require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({ role: 'superadmin' });
        if (adminExists) {
            console.log('MasterAdmin sudah ada, Dilarang membuat MasterAdmin kembali!');
            process.exit();
        }

        const superAdmin = new User({
            id: "12345678910123",
            name: "Master Admin NS3",
            email: "masteradmin@ns3.com",
            password: "masteradmin123",
            role: "superadmin",
            phoneNumber: "085312558171",
        });

        await superAdmin.save();
        console.log('✅ Berhasil membuat akun Master Admin pertama!');
        process.exit();
    } catch (error) {
        console.error('❌ Error saat seeding:', error);
        process.exit(1);
    }
};

seedSuperAdmin();