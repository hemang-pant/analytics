const appRoute = require('./routes/routes.js')
const express = require('express');
require('dotenv').config();
var cron = require('node-cron');
const {
    DeleteData, AddData,UpdateData, AggregateData, 
} = require('../mailer/controller/metrics.js')




// minute update
cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  //DeleteData('metrics','realtime-update',)
  // added minute data to firestore database
  AddData('metrics','minute-update',Date(),({"time" : Date(), "datafield1": "datafield1", "datafield2": "datafield2" }), Date().slice(0, 16).replace('T', ' '));
});

console.log("funciton calling")
// DeleteData('metrics','minute-update',)



//AddData('metrics','minute-update',Date(),({"time" : Date(), "datafield1": "datafield1", "datafield2": "datafield2" }), Date().slice(0, 16).replace('T', ' '));
//UpdateData('metrics','minute-update',Date(),({"time" : Date(), "datafield1": "datafield1", "datafield2": "datafield2" }), Date().slice(0, 16).replace('T', ' '))







// hour update
cron.schedule('0 * * * *', () => {
    console.log('running a task every hour');
    DeleteData('metrics','minute-update',)
    // added hour data to firestore database
    // delete minute details from firestore database
});

// day update
cron.schedule('0 0 * * *', () => {
    console.log('running a task every day');
    DeleteData('metrics','minute-updates',)
    // added day data to firestore database
    // delete hour details from firestore database
});

// week update
cron.schedule('0 0 * * 0', () => {
    console.log('running a task every week');
    // added week data to firestore database
    // delete day details from firestore database
});

// month update
cron.schedule('0 0 1 * *', () => {
    console.log('running a task every month');
});

// year update
cron.schedule('0 0 1 1 *', () => {
    console.log('running a task every year');
    // added year data to firestore database
    // delete month details from firestore database
});


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
    }
)

