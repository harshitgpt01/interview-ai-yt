const multer = require("multer")


/**
 * @description last middleware in the chain, turns anything thrown by a route
 * into a JSON response so the client never receives an HTML stack trace.
 */
function errorHandler(err, req, res, next) {

    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Resume PDF must be 3MB or smaller."
            })
        }

        return res.status(400).json({
            message: "Only PDF files are allowed for the resume."
        })
    }

    // mongoose duplicate key, e.g. a username or email that is already taken
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[ 0 ]

        return res.status(400).json({
            message: field
                ? `An account already exists with this ${field}`
                : "Account already exists"
        })
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: Object.values(err.errors).map(e => e.message).join(", ")
        })
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid id."
        })
    }

    console.error(err)

    res.status(500).json({
        message: "Something went wrong, please try again."
    })
}


module.exports = errorHandler
