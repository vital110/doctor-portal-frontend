const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Server running' });
});

// Database connection and server start
db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected successfully');
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
                console.log('💡 Try: lsof -ti:3001 | xargs kill -9');
                process.exit(1);
            } else {
                console.error('❌ Server error:', err);
            }
        });
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    });

module.exports = app;