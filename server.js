const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

let events = [];

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

app.get('/events', (req, res) => {
    const now = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.datetime) > now)
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    res.json(upcomingEvents);
});

app.post('/events', (req, res) => {
    const event = {
        id: Date.now(), // Unique ID for each event
        email: req.body.email,
        title: req.body.title,
        datetime: req.body.datetime,
        type: req.body.type
    };
    
    events.push(event);

    const eventTime = new Date(event.datetime).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = eventTime - currentTime - 60000; // 1 minute before

    if (timeDifference > 0) {
        setTimeout(() => {
            const mailOptions = {
                from: '',
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
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});