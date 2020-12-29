const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const dbConnect = require('./config/database')

const app = express()
const port = process.env.PORT || 8080

//middilewares
app.use(cors())
app.use(bodyParser.urlencoded({extended : true}))
// @ts-ignore
app.use(express.json({extended : false}))

//routes
const authRoutes = require('./routes/auth')
const bookRoutes = require('./routes/books')
// @ts-ignore
const reviewRoutes = require('./routes/reviews')

//routemiddilewares
app.use('/auth', authRoutes)
// @ts-ignore
app.use('/books',bookRoutes);

app.get('/', (req,res) => {
    res.send('Hi there :D!')
})


//connecting to database and port listening
dbConnect( client=> {

    app.listen(port, () => {
        console.log('app is listening on port: ', port)
    })
})
