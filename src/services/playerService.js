const express       = require('express')
const app           = express()
const path          = require("path");
const isReachable   = require('is-reachable');
const jsonfile      = require('jsonfile')
const electron      = require('electron').app


require('dotenv').config({
    path: path.join(electron.getPath('documents') + '/xscreen/.env')
    // path: path.join(__dirname + '/../../.env')
});

var screenPath = path.join(__dirname+'/../../public/screen/');

app.use('/assets',express.static(path.join(__dirname, '/../../src/assets')));
app.use('/content',express.static(path.join(electron.getPath('documents') + '/xscreen/contents')));
app.set('views', path.join(__dirname, '/../../src/views'));
app.use(express.static(path.join(__dirname, '/../../public')));
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.render("player");
})

app.get('/config', function (req, res) {
    var printable = process.env.PRINT ? 1 : 0;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        domain: 'xscreen.io',
        live: 'http://xscreen.io/live/',
        contentPath: 'http://localhost:8765/content/',
        displayKey : process.env.DISPLAY_KEY ? process.env.DISPLAY_KEY : 'DEMO',
        website: process.env.WEBSITE
    }));
})

app.get('/slide/:uid', function (req, res) {
    jsonfile.readFile(screenPath+'screendata.json', function(err, json) {
        if(err){
            res.sendStatus(404)
        } else {            
            var slide = json.playlist.find(function(slide) {
                return slide.uid == req.params.uid;
            });
            if(slide){
                var data = {
                    contentPath: 'http://localhost:8765/content/',
                    screen: json.screen,
                    slide: slide,
                    uid: req.query.uid
                };
                switch(slide.type){
                    case 'slide':
                        res.render("slide",data);
                        break;
                    case 'video':
                        res.render("video",data);
                        break;
                }
            } else {
                res.sendStatus(404)
            }
        }
    })
})

app.get('/screendata', function(req,res) {
    jsonfile.readFile(screenPath+'screendata.json', function(err, json) {
        if(err){
            res.sendStatus(404)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.send(json)
        }
    })
})

app.get('/status', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    isReachable('xscreen.io').then(reachable => {
        res.send(JSON.stringify({
            online : reachable
        }));
    });
})

app.get('/setcounter', function (req, res, data) {

    var newCounter = typeof req.query.counter !== 'undefined' ? parseInt(req.query.counter) : counter;
    counter = newCounter <= 0 ? 99 : (newCounter >= 100 ? 1 : newCounter);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        counter : counter
    }));

});


app.listen(8765, function () {
    //Server started
})
