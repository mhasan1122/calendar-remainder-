const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let events = [];

const getEvents = (req, res) => {
    try {
        const sortedEvents = events.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        res.json(sortedEvents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

const createEvent = (req, res) => {
    try {
        const event = {
            id: Date.now(),
            email: req.body.email,
            title: req.body.title,
            datetime: req.body.datetime,
            type: req.body.type
        };

        if (!event.email || !event.title || !event.datetime || !event.type) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Optional: Fix typo if "remainder" is sent instead of "reminder"
        if (event.type === 'remainder') {
            event.type = 'reminder';
        }

        events.push(event);

        const eventTime = new Date(event.datetime).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = eventTime - currentTime - 60000; // 1 minute before

        if (timeDifference > 0) {
            setTimeout(() => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: event.email,
                    subject: `Reminder: ${event.title}`,
                    text: `Dear User,\n\nThis is a reminder for your upcoming ${event.type}:\n\nTitle: ${event.title}\nTime: ${new Date(event.datetime).toLocaleString()}\n\nBest regards,\nYour Calendar App`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Email error:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            }, timeDifference);
        }

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
};

module.exports = { getEvents, createEvent };