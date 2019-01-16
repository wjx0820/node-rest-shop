const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose")

const productRoutes = require("./api/routes/products")
const orderRoutes = require("./api/routes/orders")
const userRoutes = require("./api/routes/user")

mongoose.connect(
  "mongodb://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-shard-00-00-crmux.mongodb.net:27017,cluster0-shard-00-01-crmux.mongodb.net:27017,cluster0-shard-00-02-crmux.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true }
)

app.use(morgan("dev"))
app.use("/uploads", express.static("uploads"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }
  next()
})

//Routes which should handle requests
app.use("/products", productRoutes)
app.use("/orders", orderRoutes)
app.use("/user", userRoutes)

// app.all("/", (req, res) => {
//   res.status(200).json({
//     message: "It works"
//   })
// })
// app.listen(3000, () => {
//   console.log("Server ready")
// })

//Error handling
app.use((req, res, next) => {
  const error = new Error("Not found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
