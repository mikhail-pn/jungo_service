/**
 * Created by nik on 02.05.17.
 */
const ERRORS_CODES = {
    'ETIMEDOUT': 504
};

module.exports = function (err, req, res, next) {
    console.error(err);
    res.status(ERRORS_CODES[err.code] || 404).json({error: err.message || err});
};
