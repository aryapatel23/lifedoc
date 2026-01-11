const User = require('../models/User');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ type: 'doctor' })
            .select('-password -otp -otpExpires') // Exclude sensitive info
            .sort({ name: 1 });

        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};
