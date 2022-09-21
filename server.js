const express = require('express')

//const { path } = require('path')

const app = express()

// List of all the files that should be served as-is
let protecteds = ['transformed.js', 'main.css', 'favicon.ico']

app.get("*", (req, res) => {

    let path = req.params['0'].substring(1)

    if (protecteds.includes(path)) {
        // Return the actual file
        res.sendFile(`${__dirname}/build/${path}`);
    } else {
        // Otherwise, redirect to /build/index.html
        res.sendFile(`${__dirname}/build/index.html`);
    }
});

app.listen(process.env.PORT || 3000, (err) => {
    if (err) { return console.log(err) }

    console.log('Tudo funcionando.')
})