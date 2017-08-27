var sid = 'AC800e0b4f00d2e58851c79dc5ef603aac';
var tkn = '2d813bba8b02ab5bc292201ceacb50b8';
var twilio = require('twilio');
var client = new twilio(sid, tkn);
var logger = require(`${__basedir}/logger`);

module.exports = {
    sendSms: (to, body) => {
        logger.info('sending sms');

        client.messages.create({
            body: body,
            to: to,
            from: '+19703153614'
        });

        logger.info('sms sent');
    }
};