// Copyright (c) 2024 Learnosity, Apache 2.0 License
//
// Unified quickstart server with all API examples
'use strict';

const path = require('path');
const Learnosity = require('../../index');
const DataApi = require('../../lib/DataApi');
const config = require('./config');
const express = require('express');
const packageJson = require('../../package.json');
const app = express();
const port = 8001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static CSS files
app.use('/css', express.static(path.join(__dirname, 'css')));


// Items API - Standalone Assessment
app.get('/', function (req, res) {
    const learnositySdk = new Learnosity();
    const user_id = Learnosity.Uuid.generate();
    const session_id = Learnosity.Uuid.generate();

    const request = learnositySdk.init(
        'items',
        {
            consumer_key: config.consumerKey,
            domain: req.hostname
        },
        config.consumerSecret,
        {
            user_id: user_id,
            activity_template_id: '7169d747-2ca1-4398-8a6d-ac53e93d2bc1',
            session_id: session_id,
            activity_id: 'office_guessr_1',
            rendering_type: 'assess',
            type: 'submit_practice',
            name: 'Office Guessr',
            state: 'initial',
            config: {
                configuration: {
                    onsubmit_redirect_url: `/reportsapi?user_id=${user_id}&session_id=${session_id}`
                }
            }
        }
    );

    res.render('standalone-assessment', { request });
});

// Reports API
app.get('/reportsapi', function (req, res) {

    const { user_id, session_id } = req.query;

    console.log('New report session started!');
    console.log(`User id: ${user_id}`);
    console.log(`Session id: ${session_id}`);

    const learnositySdk = new Learnosity();

    const request = learnositySdk.init(
        'reports',
        {
            consumer_key: config.consumerKey,
            domain: req.hostname
        },
        config.consumerSecret,
        {
            reports: [
                {
                    id: 'session-detail',
                    type: 'session-detail-by-item',
                    user_id: user_id,
                    session_id: session_id
                }
            ]
        }
    );

    res.render('reports', { request });
});



if (require.main === module) {
    app.listen(port, function () {
        console.log(`Server started http://${domain}:${port}. Press Ctrl-c to quit.`);
    });
}

module.exports = app;
