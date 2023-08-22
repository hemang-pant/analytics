const appRoute = require('./routes/routes.js')
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());

app.use('/api',appRoute)

app.route('/recipients/:recipient').get((req, res) => {
    var Recipient = req.params['recipient'];
    var date_ob = new Date().toISOString().slice(0, 19).replace('T', ' ');
    res.send ({"time" : date_ob, });
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

