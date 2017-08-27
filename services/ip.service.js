var ip = require('ip');
var fs = require('fs');
var ip_path = `${__basedir}/resources/current_ip.txt`;
var saved_ip;

fs.readFile(ip_path, 'utf8', (err, data) => {
    if (err)
       logger.error('Error getting IP address from filesystem', err);
    else
        saved_ip = data;
});

module.exports = {
    getIP: () => {
        return ip.address();
    },
    isNewIP: () => {
        var currentIP = this.getIP();
        var isNew = currentIP === saved_ip;

        if (isNew)
            this.saveIP(currentIP);

        return isNew;
    },
    saveIP: (ip) => {
        fs.writeFile(ip_path, ip, (err) => {
            if (err)
                logger.error('**** error saving ip address to filesystem ****', err);
            else
                logger.info('**** IP address saved successfully ****');
        });
    }
};