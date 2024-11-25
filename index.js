const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const connection = require("./database/db");
dotenv.config();

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error uncaughtException: ${err.message}`);
    process.exit(1);
});

const app = express();
const port = 8000;


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.use('/api', bookingRoutes);
app.use('/api', adminRoutes);
app.use('/api', doctorRouter);


// deployment
__dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/out/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'out', 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! ðŸš€');
    });
}

app.listen(port, () => { console.log(`Server On Running Port http://localhost:${port}`) });


// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error unhandledRejection: ${err.message}`);
    app.close(() => {
        process.exit(1);
    });
});