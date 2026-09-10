const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

require('./db');
const parkingRoutes = require('./routes/parkingRoutes');
const userRoutes = require('./routes/user');
const logger = require('./middleware/logger');
const authenticateToken = require('./middleware/authenticateToken');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

app.use(mongoSanitize());

app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100,
    message: { message: 'Terlalu banyak request dari IP ini, coba lagi nanti.' }
});
app.use('/api/', limiter);

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.get('/', (req, res) => res.send('API Sistem Parkir Gandaria City Mall Berjalan!'));
app.use('/api/users', userRoutes);
app.use('/api/parking', authenticateToken, parkingRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Terjadi kesalahan internal server', error: err.message });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));