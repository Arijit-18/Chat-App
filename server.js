var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose');
var port = process.env.PORT || 5000
const { send } = require("process")
const { sendStatus } = require("express/lib/response")

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbURL = 'mongodb+srv://arijit18:arijit45@cluster0.108ac.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


//our model
var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages',(req,res) => {
    Message.find({}, (err,messages) => {
        res.send(messages)
    })
    
})

app.post('/messages',(req,res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err)
            sendStatus(500)
        //messages.push(req.body);
        io.emit('message', req.body)
        res.sendStatus(200)
    })
})

io.on('connection', (socket) => {
    console.log("user connected")
})

mongoose.connect(dbURL, (err) => {
    console.log("mongodb connection successful");
})

var server = http.listen(port, () => {
    console.log("Server is listening on port %d", port)
});
