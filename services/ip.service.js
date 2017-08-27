var ip = require('ip');
var fs = require('fs');
var logger = require(`${__basedir}/logger`);
var ip_path = `${__basedir}/resources/current_ip.txt`;
var saved_ip;

fs.readFileSync(ip_path, 'utf8', (err, data) => {
    if (err)
       logger.error('Error getting IP address from filesystem', err);
    else {
        logger.info(`Found IP from filesystem => ${data}`);
        saved_ip = data;
    }
});

saveIP = (ip) => {
    fs.writeFile(ip_path, ip, (err) => {
        if (err)
            logger.error('**** error saving ip address to filesystem ****', err);
        else
            logger.info('**** IP address saved successfully ****');
    });
}

module.exports = {
    getIP: () => {
        return ip.address();
    },
    isNewIP: () => {
        var currentIP = ip.address();
        var isNew = currentIP !== saved_ip;

        logger.info(`it is ${isNew} that the IP is new`);
        logger.info(`current IP is ${currentIP} and the saved IP is ${saved_ip}`);

        if (isNew)
            saveIP(currentIP);

        return isNew;
    }
};