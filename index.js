var express = require('express');
var expressHbs = require('express-handlebars');
var app = express();
const Handlebars = require('handlebars')
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var doianh = '/data/uploads/';
const axios = require('axios');
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({extended: true}))
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var urlencodedParser = bodyParser.urlencoded({extended: false})

mongoose.connect('mongodb://phancanh:canhphan1234@canhcluster-shard-00-00.nt3jr.mongodb.net:27017,canhcluster-shard-00-01.nt3jr.mongodb.net:27017,canhcluster-shard-00-02.nt3jr.mongodb.net:27017/TINDERASSIGMENT?ssl=true&replicaSet=atlas-13d0nc-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => console.log('Successfully connected to MongoDB'));
db.on('error', (e) => console.log(e));

//tải ảnh
var imgs = ""
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //cho phép tải  mỗi  anh png
            cb(null, './public/data/uploads');
        } else {
            cb(new Error('đuôi'), null);
            return
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        imgs = doianh.concat(file.originalname);
        console.log(file);
    }
})


var upload = multer({
    dest: ('./public/data/uploads')
    , storage: storage,
}).single('avatarUser')
app.engine('handlebars', expressHbs({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'appweb',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.use(express.static('assets'));
app.use(express.static('public/data/uploads'));
var user = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    andress: String,
    city: String,
    street: String,
    avatar: String,
})


app.get('/friend', upload, function (req, res) {
    var usefind = db.model('users', user);
    usefind.find({}, (err, users) => {
        if (err) {
            console.log('ERROL' + err.message);
        } else {
            users.forEach(function (item) {
            });
        }
        res.render('friend', {users: users})
    })
});
app.get('/search', upload, function (req, res) {
    var usefind = db.model('users', user);
    var test = req.query.searchuser;
    if (test.length > 0) {
        usefind.find({fullname: req.query.searchuser}, (err, users) => {
            if (err) {
                console.log('ERROL' + err.message);
            } else {
                console.log('fullnamess' + users);
                res.render('friend', {users: users})
            }
        })
    } else {
        res.send(usefind);
    }

});

app.get("/login_user", function (req, res) {
    var usefind = db.model('users', user);
        usefind.findOne({email:req.query.emailss,fullname: req.query.passwordss}, (err, users) => {
            if (err) {
                console.log('ERROL' + err.message);
            } else {
               if (users!=undefined){
                   res.redirect('/friend');
               }
               else {
                   res.send("khong duoc roi")
               }
            }
        })
})

app.get('/getUserList', upload, function (req, res) {
    var usefind = db.model('users', user);
    usefind.find({}, (err, users) => {
        if (err) {
            console.log('LOG ERROR' + err.message);
        } else {
            users.forEach(function (item) {
            });
            res.send(users);
        }

    })
});


app.get('/', function (req, res) {
    res.render('index', {layout: 'indexmain'});

});
app.post('/insertUser',upload, function (req, res) {
    var insert = db.model('user', user);
    insert({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        andress: req.body.andress,
        city: req.body.city,
        street: req.body.street,
        avatar: req.file.originalname,
    }).save(function (err) {
        if (err) {
            console.log('đã lỗi ' + err.message)
            res.send('đã lỗi rồi bạn ơi ' + err.message)
        } else {
            res.render('addprofile');
        }
    });

});

app.get('/appweb', function (req, res) {
    res.render("friend", {layout: 'appweb'});
});

app.get('/login', function (req, res) {
    res.render("login", {layout: 'main',});

});
app.get('/addprofile', function (req, res) {
    res.render("addprofile", {layout: 'appweb'});
});
app.get('/delete/:id', function (req, res) {
    var insert = db.model('user', user);
    var id = req.params.id
    insert.findByIdAndRemove(id, (err, user) => {
        if (err) {
            console.log("error: " + err.message);
        } else {
            res.redirect('/friend')
        }
    })
})
app.get('/update=:id', function (req, res) {
    var insert = db.model('user', user);
    insert.findById(req.params.id, function (err, user) {
        if (err) {
            console.log("đã lỗi " + err.message);
        } else {
            res.render('update', {update: user})
        }
    })
})
app.get('/test', upload, function (req, res) {
    var usefind = db.model('users', user);
    usefind.find({}, (err, users) => {
        if (err) {
            console.log('ERROL' + err.message);
        } else {
            users.forEach(function (item) {
            });
        }
        res.render('test', {users: users})
    })

})


app.post('/update=:id', upload, function (req, res) {
    var insert = db.model('user', user);
    insert.updateOne({_id: req.body.id}, {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        andress: req.body.andress,
        city: req.body.city,
        street: req.body.street,
        avatar: 'yong.png',
    }, function (err, user) {
        if (err) {
            console.log("đã lỗi " + err.message);
        } else {
            res.redirect("friend");
        }
    })
})

app.listen(process.env.PORT || '3000', function () {
    console.log("Open PORT");
});

