const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('./eventController');

router.get('/events', getEvents);
router.post('/events', createEvent);

module.exports = router;