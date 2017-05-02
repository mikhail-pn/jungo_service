const router = require('express').Router();
const jungoService = require('./jungo_service');

router.post('/jungo', (req, res, next) => {
    const timeStart = Date.now();
    jungoService(req)
        .then((result) => {
        res.header('X-RESPONSE-TIME', Date.now() - timeStart);
        console.log(Date.now() - timeStart);
            res.json(result);
        })
        .catch(next);
});

module.exports = router;
