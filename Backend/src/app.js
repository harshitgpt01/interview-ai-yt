const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


/* error handler goes last so it can catch anything thrown above */
const errorHandler = require("./middlewares/error.middleware")

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found."
    })
})

app.use(errorHandler)


module.exports = app