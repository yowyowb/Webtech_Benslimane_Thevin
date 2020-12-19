const appErrors = require('./appErrors')

module.exports = {

    ...appErrors,

    requestWrapper: fn => (req, res, next) => fn(req, res, next).catch(next),

    errorHandler: (err, req, res, next) => {
        if (err instanceof appErrors.HttpError) {
            res.status(err.code).json(err)
        } else {
            res.status(500).json({ message: 'Unknown Server Error' });
        }
    },
}
