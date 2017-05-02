const request = require('request');

const PATH = 'http://88.99.174.234:9090';
const TIMEOUT = 5000;

function sendRequest(rstream) {
    return new Promise((resolve, reject) => {
        request.post({
            url: PATH,
            timeout: TIMEOUT,
            formData: {
                file: rstream
            }
        }, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(res.statusCode));
            }
            return resolve(body);
        });
    });
}

module.exports = sendRequest;
