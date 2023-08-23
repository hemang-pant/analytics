const nodemailer = require('nodemailer');
require('dotenv').config();
const {db} = require('./firebaseController')
var uap = require('ua-parser-js');
const { UpdateData } = require('./metrics');
db.settings({ ignoreUndefinedProperties: true });



const testMail = async (req, res) => {
    let user;
    let pass;
    let testAccount = await nodemailer.createTestAccount().then((account) => {
        console.log(account);
        user = account.user;
        pass = account.pass;
    });
    testAccount;
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', port: 587, secure: false,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        },
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: user,
          pass: pass,
        }
      });

    let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "hemangpant2002@gmail.com, xniyan1@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    };

    transporter.sendMail(message).then(info => {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return res.status(201).json({message: "YOU SHOULD RECEIVE AN EMAIL..!"});
    }).catch(err => {
        console.log(err);
        return res.status(500).json({err});
    });
    


    // res.status(201).json("Signup Successfully..!");
}

const sendMail = (req, res) => {


    const { userEmail, subject,
        testId, version, campaign_id,
        customer_id, messageID, template_id,
        template_version
     } = req.body;
    const user = process.env.USER;
    const pass = process.env.PASS;
    let config = {
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    }
    let transporter = nodemailer.createTransport(config);
    var eventRef = db.collection('messages').doc();
    eventRef.set({
        message_id: eventRef.id,
            
    }).then(ref => {
        console.log('Added document with ID: ', eventRef.id);    
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
    var message_size = 0;
    let message = {
        
        from: 'hemangpant2002@gmail.com',
        to: userEmail,
        subject: subject,
        html: '<p>script starts '+eventRef.id+' <script>var text = httpGet("https://tracker-6w2m.onrender.com/api/events/'+
        userEmail+
        '?ab_test_id='+testId+
        '&ab_test_version='+version+
        '&campaign_id='+campaign_id+
        '&customer_id='+customer_id+
        '&msg_size='+message_size+
        '&message_id='+eventRef.id+
        '&subject='+subject+
        '&template_id='+template_id+
        '&template_version='+template_version+
        '");obj = JSON.parse(text);alert(obj.ISteamClient.online);function httpGet(theUrl){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", theUrl, false ); xmlHttp.send( null );return xmlHttp.responseText;}</script><Hi this is visible content or your message body</p><img src = "" style="display:none">  <picture><source media="(min-width:465px)" srcset="https://tracker-6w2m.onrender.com/api/events/'+
        userEmail+
        '?ab_test_id='+testId+
        '&ab_test_version='+version+
        '&campaign_id='+campaign_id+
        '&customer_id='+customer_id+
        '&msg_size='+1337+
        '&message_id='+eventRef.id+
        '&subject='+subject+
        '&template_id='+template_id+
        '&template_version='+template_version+
        '"><img src="https://tracker-6w2m.onrender.com/api/events/'+
        userEmail+
        '?ab_test_id='+testId+
        '&ab_test_version='+version+
        '&campaign_id='+campaign_id+
        '&customer_id='+customer_id+
        '&msg_size='+1337+
        '&message_id='+eventRef.id+
        '&subject='+subject+
        '&template_id='+template_id+
        '&template_version='+template_version+
        '" alt="Flowers" style="display:none"></picture>'
    }
    console.log('"https://tracker-6w2m.onrender.com/api/events/'+userEmail+'">');
    message_size = message.html.length;
    transporter.sendMail(message).then(info => {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return res.status(201).json({
            message: "YOU SHOULD RECEIVE AN EMAIL..!",
            info : info,
            url : nodemailer.getTestMessageUrl(info),
            subject: subject,
            userEmail: userEmail
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({err});
    });
}

const getId = (req, res) => {
    var recipient = req.params['recipient'];
    var date_ob = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var ua = new uap(req.headers['user-agent']);
    var getHighEntropyValues = 'Sec-CH-UA-Full-Version-List, Sec-CH-UA-Mobile, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness';
    res.setHeader('Accept-CH', getHighEntropyValues);
    res.setHeader('Critical-CH', getHighEntropyValues);
    // return res.status(201).json({
    //     // message: "YOU SHOULD RECEIVE AN EMAIL..!",
    //     // info : recipient,
    //     // //url : nodemailer.getTestMessageUrl(info),
    //     // subject: 'Email has been tracked',
    //     // userEmail: recipient,
    //     "ua":ua.getResult().stringify()
    //     // "request header": req.headers,
    //     // "request body":req.body,
    //     // "ip address":req.header('x-forwarded-for') ||
    //     //                 req.socket.remoteAddress,
    //     // "ip address temp ":req.socket.remoteAddress,
    //     // "client ip": req.clientIp,
    //     // "ip address temp 2":req.connection.remoteAddress,
    //     });
    //var ua = uap(req.headers).withClientHints();

    // upload data to firestore
    var eventRef = db.collection('events').doc(req.query.message_id);
    const doc  = eventRef.get().then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
            UpdateData(
                'metrics',
                'minute-update',
                ua.getResult().os.name == "Windows"||"Mac OS" ? 1 : 0,
                ua.getResult().device.type == "mobile" ? 1 : 0,
                ua.getResult().device.type == "tablet" ? 1: 0,
            );
            eventRef.set({
                ab_test_id: req.query.ab_test_id,
                ab_test_version: req.query.ab_test_version,
                amp_enabled: true,
                campaign_id: req.query.campaign_id,
                click_tracking: true,
                customer_id: req.query.customer_id,
                delv_method: "esmtp",
                event_id: eventRef.id,
                friendly_from: recipient,
                geo_ip: {
                  country: "not defined",
                  region: "not defined",
                  city: "not defined",
                  latitude: "not defined",
                  longitude: "not defined",
                  zip: "not defined",
                  postal_code: "node defined"
                },
                injection_time: date_ob,
                initial_pixel: true,
                ip_address: req.ip,
                ip_pool: req.ip,
                mailbox_provider: "not tracked",
                mailbox_provider_region: "not tracked",
                message_id: req.query.message_id,
                msg_from: process.env.USER,
                msg_size: req.query.msg_size,
                num_retries: 1,
                open_tracking: true,
                queue_time: "12",
                rcpt_meta: {
                  customKey: "customValue"
                },
                rcpt_tags: ["undefined"],
                rcpt_to: recipient,
                rcpt_hash: "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed",
                raw_rcpt_to: recipient,
                rcpt_type: "cc",
                recipient_domain: "example.com",
                routing_domain: "example.com",
                scheduled_time: "node defined",
                sending_ip: "not defined",
                subaccount_id: "not defined",
                subject: req.query.subject,
                template_id: req.query.template_id,
                template_version: req.query.template_version,
                timestamp: "1588348800",
                transmission_id: "65832150921904138",
                type: "open",
                user_agent: req.headers['user-agent'],
                user_agent_parsed: {
                  agent_family: ua.getResult().browser.name,
                  device_brand: ua.getResult().device.vendor,
                  device_family: ua.getResult().device.model,
                  os_family: ua.getResult().os.name,
                  os_version: ua.getResult().os.version,
                  is_mobile: ua.getResult().device.type == "mobile" ? true : false,
                  is_proxy: false,
                  is_prefetched: false
                }
        }).then(ref => {
            //console.log('Added document with ID: ', eventRef.id);    
            console.log("function called using api")
            UpdateData(
                'metrics',
                'minute-update',
                ua.getResult().os.name == "Windows"||"Mac OS" ? 1 : 0,
                ua.getResult().device.type == "mobile" ? 1 : 0,
                ua.getResult().device.type == "tablet" ? 1: 0,
            );
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
        } else {
            //console.log('Document data:', doc.data());
            eventRef.update({
                num_retries: doc.data().num_retries + 1
            });
            UpdateData(
                'metrics',
                'minute-update',
                ua.getResult().os.name == "Windows"||"Mac OS" ? 1 : 0,
                ua.getResult().device.type == "mobile" ? 1 : 0,
                ua.getResult().device.type == "tablet" ? 1 : 0,

            );
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });

    const user = process.env.USER;
    const pass = process.env.PASS;
    let config = {
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    }
    let transporter = nodemailer.createTransport(config);

    let message = {
        from: 'hemangpant2002@gmail.com',
        to: 'xniyan1@gmail.com',
        subject: 'Email has been tracked full data',
        html: "<p>Email has been tracked : "+recipient
        +"</p><p>Time : "+date_ob
        +"</p><p>user agent : "+ua+
        "</p><p>browser name : "+ua.getResult().browser.name+
        "</p><p>browser version : "+ua.getResult().browser.version+
        "</p><p>os name : "+ua.getResult().os.name+
        "</p><p>os version: "+ua.getResult().os.version+
        "</p><p>device model: "+ua.getResult().device.model+
        "</p><p>device type: "+ua.getResult().device.type+
        "</p><p>device vendor: "+ua.getResult().device.vendor+
        "</p><p>cpu architecture: "+ua.getResult().cpu.architecture+
        "</p><p>engime name: "+ua.getResult().engine.name+
        "</p><p>engine version: "+ua.getResult().engine.version+
        "</p><p>Request Body : "+req.body.toString()+
        "</p><p>Request header : "+req.headers.toString()+
        "</p><p>IP Address : "+req.socket.remoteAddress.toString()+
        //"</p><p>Client IP : "+req.clientIp.toString()+
        "</p><p>IP Address : "+req.connection.remoteAddress.toString()+"</p>"
    }

    transporter.sendMail(message).then(info => {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return res.status(201).json({
            message: "YOU SHOULD RECEIVE AN EMAIL..!",
            info : info,
            url : nodemailer.getTestMessageUrl(info),
            subject: 'Email has been tracked',
            userEmail: recipient,
            "ua":ua.getResult(),
            "request header":req.headers['user-agent'],
            "request header": req.headers,
            "request body":req.body,
            "ip address":req.header('x-forwarded-for') ||
                            req.socket.remoteAddress,
            "ip address temp ":req.socket.remoteAddress,
            "client ip": req.clientIp,
            "ip address temp 2":req.connection.remoteAddress,
            });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({err});
    });
}

const getMetrics = (req, res) => {
    try{
        minuteref = db.collection('metrics').doc('minute-update').collection('timeseries').orderBy("time", "desc");
        // hourref = db.collection('metrics').doc('hourly-update').collection('timeseries').orderBy("time", "desc");
        totalDesktop = 0;
        totalMobile = 0;
        totalTablet = 0;
        timeseries = [];
        minuteref.get().then((res) => {
            if (!res.empty) {
                res.forEach((doc) => {
                    totalDesktop += doc.data().totalDesktop;
                    totalMobile += doc.data().totalMobile;
                    totalTablet += doc.data().totalTablet;
                    timeseries.push({
                        totalOpens: doc.data().totalOpens,
                        time: doc.data().time
                    });
                });
            }
        });
        // hourref.get().then((res) => {
        //     if (!res.empty) {
        //         res.forEach((doc) => {
        //             totalDesktop += doc.data().totalDesktop;
        //             totalMobile += doc.data().totalMobile;
        //             totalTablet += doc.data().totalTablet;
        //             timeseries.push({
        //                 totalOpens: doc.data().totalOpens,
        //                 time: doc.data().time
        //             });
        //         });
        //     }
        // });
        
        payload = {
            opens_by_device: {
              desktop: 100,
              mobile: 80,
              tablet: 49,
            },
            // calculates every minute
            timeseries: [
              {
                totalOpens: 1200,
                time: '8/19/2023, 6:48:00 PM'
              },
              {
                totalOpens: 200,
                time: '8/19/2023, 6:49:00 PM'
              },
              {
                totalOpens: 0,
                time: '8/19/2023, 6:50:00 PM'
              },
              {
                totalOpens: 200030,
                time: '8/19/2023, 6:51:00 PM'
              },
              {
                totalOpens: 10,
                time: '8/19/2023, 6:52:00 PM'
              },
              {
                totalOpens: 90,
                time: '8/19/2023, 6:53:00 PM'
              },
            ]
          }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err});
    }
}






// get 

// const events




module.exports = {
    testMail, sendMail, getId, getMetrics
}