const request = require('request');
const multiparty = require('multiparty');
const crypto = require('crypto');
const bulbService = require('./bulb_service');
const fs = require('fs');
const DOWNLOAD_TIMEOUT = 10000;

/**
 *
 * @param req
 * @returns {Promise}
 */
module.exports = function (req) {
    if (req.body && req.body instanceof Array) {
        return fromArrayUrls(req.body);
    }

    return fromFormData(req);
};

function fromFormData(req) {
    return new Promise((resolve, reject) => {
        const form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            if (err) {
                return reject(err);
            }
            let filePath;
            for (let i in files) {
                if (files.hasOwnProperty(i) && files[i][0]) {
                    filePath = files[i][0].path;
                    break;
                }
            }
            const rstream = fs.createReadStream(filePath);

            return resolve(Promise.all([bulbService(rstream), makeHashBody(rstream)])
                .then((result) => {
                    const hash = crypto.createHash('sha1');
                    hash.update(result[0] + result[1]);
                    return [hash.digest('hex')];
                }));
        });
    })
}

function fromArrayUrls(urls) {
    const promises = [];

    urls.forEach((url) => {
        const rstream = request({
            url,
            timeout: DOWNLOAD_TIMEOUT
        });

        const promise = Promise.all([bulbService(rstream), makeHashBody(rstream)])
            .then((result) => {
                const hash = crypto.createHash('sha1');
                hash.update(result[0] + result[1]);
                return hash.digest('hex');
            });

        promises.push(promise);
    });

    return Promise.all(promises);
}

function makeHashBody(rstream) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha1');
        hash.setEncoding('hex');

        rstream.on('end', function () {
            hash.end();
            resolve(hash.read());
        });

        rstream.on('error', reject);

        rstream.pipe(hash);
    })
}
