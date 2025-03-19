const express = require('express');
const app = express();
const port = 8001;
const eventRoutes = require('./eventRoute');

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

app.use('/api', eventRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});