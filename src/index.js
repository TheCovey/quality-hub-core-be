require('dotenv').config()
const express = require('express');
const server = require('./server');

server.express.use('/doc', express.static("doc/schema"));

const options = { PORT: process.env.PORT || 4000 };

server.start(options, ({ PORT }) => {
	console.log(`Running on ${PORT}`);
});