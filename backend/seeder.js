const dotenv = require('dotenv');
const User = require('./models/User');
const Lead = require('./models/Lead');

dotenv.config();

const importData = async () => {
    try {
        await User.deleteMany();
        await Lead.deleteMany();

        await User.create({
            name: 'Admin User',
            email: 'admin@ace.com',
            password: 'password123',
            role: 'admin'
        });

        await User.create({
            name: 'Sales Rep',
            email: 'user@test.com',
            password: 'password123',
            role: 'sales'
        });

        console.log('Data Imported!');
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === '-i') {
    importData();
}
