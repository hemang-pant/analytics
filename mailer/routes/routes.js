const router = require('express').Router();

const {testMail, getId, sendMail} = require('../controller/appController.js')


router.post('/user/testmail', testMail);
router.post('/user/sendmail', sendMail);
router.get('/events/:recipient', getId);

module.exports = router;