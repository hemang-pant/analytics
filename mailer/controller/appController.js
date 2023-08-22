const nodemailer = require('nodemailer');
require('dotenv').config();


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


    const { userEmail, subject } = req.body;
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
        to: userEmail,
        subject: subject,
        html: '<p>script starts <script>var text = httpGet("https://tracker-6w2m.onrender.com/api/tracker/'+userEmail+'");obj = JSON.parse(text);alert(obj.ISteamClient.online);function httpGet(theUrl){var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", theUrl, false ); xmlHttp.send( null );return xmlHttp.responseText;}</script><Hi this is visible content or your message body</p><img src = "" style="display:none">  <picture><source media="(min-width:465px)" srcset="https://tracker-6w2m.onrender.com/api/tracker/'+userEmail+'"><img src="https://tracker-6w2m.onrender.com/api/tracker/'+userEmail+'" alt="Flowers" style="display:none"></picture>' 
    }
    console.log('"https://tracker-6w2m.onrender.com/api/tracker/'+userEmail+'">');

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
        subject: 'Email has been tracked',
        html: '<p>Email has been tracked : '+recipient+'</p>' 
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



// get 

// const events




module.exports = {
    testMail, sendMail, getId
}