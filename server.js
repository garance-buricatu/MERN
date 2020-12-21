// Get express server up and running
const express = require('express'); 
const connectDB = require('./config/db');

const app = express();

// Connect database
connectDB();

app.get('/', (req, res) => res.send('API Running')); //endpount to test

const PORT = process.env.PORT || 5000; // looks for environament variable called "PORT" to use, lcoally (is there is not environment variable set), use port 5000 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // this will happen once it connects

