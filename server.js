// Copyright (c) Alex Ellis 2021. All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2021. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict"

const fs = require('fs');
const express = require('express')
const app = express()

const listenerHandlers = require('./listeners/all.js');
const widgetHandlers = require('./widgets/all.js');
const manifest = {
    rootWidget: 'main'
};

const defaultMaxSize = '100kb' // body-parser default

app.disable('x-powered-by');

const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize
const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize

app.use(function addDefaultContentType(req, res, next) {
    // When no content-type is given, the body element is set to
    // nil, and has been a source of contention for new users.

    if (!req.headers['content-type']) {
        req.headers['content-type'] = "text/plain"
    }
    next()
})

if (process.env.RAW_BODY === 'true') {
    app.use(express.raw({ type: '*/*', limit: rawLimit }))
} else {
    app.use(express.text({ type: "text/*" }));
    app.use(express.json({ limit: jsonLimit }));
    app.use(express.urlencoded({ extended: true }));
}

const middleware = async (req, res) => {
    console.log("Request body", req.body);
    // Checking whether middleware received a Resource or Action request
    if (req.body.resource) {
        handleAppResource(req, res);
    } else if (req.body.action) {
        handleAppListener(req, res);
    } else if (req.body.widget) {
        handleAppWidget(req, res);
    } else {
        handleAppManifest(req, res);
    }
};

function handleAppResource(req, res) {
    const resources_path = "./resources/";

    // Checking file extensions according to which ones Flutter can handle
    if (req.body.resource.match(/.*(\.jpeg|\.jpg|\.png|\.gif|\.webp|\.bmp|\.wbmp)$/)) {
        res.sendFile(req.body.resource, { root: resources_path });
    } else {
        res.sendStatus(404);
    }
}

async function handleAppManifest(req, res) {
    res.status(200).json({ manifest: manifest });
}

async function handleAppWidget(req, res) {

    let { widget, data, props } = req.body;

    if (Object.keys(widgetHandlers).includes(widget)) {
        let possibleFutureRes;
        try {
            possibleFutureRes = Promise.resolve(widgetHandlers[widget](data, props));
        }
        catch (e) {
            possibleFutureRes = Promise.reject(e);
        }

        return possibleFutureRes
            .then(widget => {

                res.status(200).json({ widget: widget });
            })
            .catch(err => {
                const err_string = err.toString ? err.toString() : err;
                console.error('handleAppWidget:', err_string, err.stack);
                res.status(500).send(err_string);
            });
    } else {
        let msg = `No widget found for name ${widget} in app manifest.`;
        console.error(msg);
        res.status(404).send(msg);
    }

}

/**
 * This is the main entry point for the OpenFaaS function.
 *
 * This function will call the index.js file of the application
 * when the page change.
 * If an event is triggered, the matched event function provided by the app is triggered.
 * The event can be a listener or a widget update.
 */
 async function handleAppListener(req, res) {
    let { action, props, event, api } = req.body;
    /*
        listeners file need to exactly math with action name
    */
    if (Object.keys(listenerHandlers).includes(action)) {
        let possibleFutureRes = listenerHandlers[action](props, event, api);

        return Promise.resolve(possibleFutureRes)
            .then(() => {
                res.status(200).send();
            })
            .catch(err => {
                const err_string = err.toString ? err.toString() : err;
                console.error('handleAppAction:', err_string);
                res.status(500).send(err_string);
            });
    } else {
        console.error(`No listener found for action ${action} in app manifest.`);
        res.status(404).send(`No listener found for action ${action} in app manifest.`);
    }
}

//middleware to catch ressource
app.post('/*', middleware);

const port = process.env.http_port || 3000;

app.listen(port, () => {
    console.log(`node listening on port: ${port}`);
});
