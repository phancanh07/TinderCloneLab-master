var express = require('express');
var expressHbs = require('express-handlebars');
var app = express();
const Handlebars = require('handlebars')
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var alert = require('alert');
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({extended: true}))
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var urlencodedParser = bodyParser.urlencoded({extended: false})

mongoose.connect('mongodb://phancanh:canhphan1234@canhcluster-shard-00-00.nt3jr.mongodb.net:27017,canhcluster-shard-00-01.nt3jr.mongodb.net:27017,canhcluster-shard-00-02.nt3jr.mongodb.net:27017/WALLPAPER?ssl=true&replicaSet=atlas-13d0nc-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => console.log('Successfully connected to MongoDB'));
db.on('error', (e) => console.log(e));

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },

})


var upload = multer({
    dest: ('./public/data/uploads')
    , storage: storage,

}).array('avatar', 200);


app.engine('handlebars', expressHbs({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'layout',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.use(express.static('assets'));
app.use(express.static('public/data/uploads'));
app.use(express.static('C:\\Users\\Admin\\AppData\\Local\\Temp\\'));

var image = new mongoose.Schema({
    tenanh: String,
    avatar: Array,
})

var insert = db.model('imageList', image);
app.get('/them', (req, res) => {
    res.render('indexs');
});
app.get('/', (req, res) => {
    res.render('buttons');
});

app.post('/submit', upload, function (req, res) {
    insert({
        avatar: req.files,
        tenanh: req.body.tenanh,
    }).save(function (err) {
        if (err) {
            res.send('đã lỗi rồi bạn ơi ' + err.message)
        } else {
            console.log('thanh cong');
            res.render('buttons');
        }
    });
})
app.get('/danhsach', upload, function (req, res) {

    insert.find({}, (err, users) => {
        if (err) {
            console.log('ERROL' + err.message);
        } else {
            res.render('danhsach', {sanpham: users})
        }
    })
})
app.get('/getlist', upload, function (req, res) {

    insert.find({}, (err, users) => {
        if (err) {
            console.log('ERROL' + err.message);
        } else {
            res.send(users);
        }
    })
})

app.get('/delete/:id', upload, function (req, res) {
    var id = req.params.id
    insert.findByIdAndRemove(id, (err, user) => {
        if (err) {
            console.log("error: " + err.message);
        } else {
            res.redirect('/')
        }
    })

})
app.get('/update=:id', function (req, res) {
    insert.findById(req.params.id, function (err, user) {
        if (err) {
            console.log("đã lỗi " + err.message);
        } else {
            res.render('update', {update: user})
        }
    })

})
app.post('/update', upload, function (req, res) {
    insert.updateOne({_id: req.body.ids}, {
        tenanh: req.body.tenanh,
        avatar: req.body.avatars,
    }, function (err, user) {
        if (err) {
            console.log("đã lỗi " + err.message);
        } else {
            res.send(user);
        }
    })
})
app.get('/search', upload, function (req, res) {

    insert.find({
        sodan: {
            $lte: 10, $lte: 20
        }


    }, (err, users) => {
        if (err) {
            console.log('ERROL' + err.message);
        } else {
            res.send(users);
        }
    })
})

// app.get('/friend', upload, function (req, res) {

// });
// app.get('/search', upload, function (req, res) {
//     var usefind = db.model('users', user);
//     var test = req.query.searchuser;
//     if (test.length > 0) {
//         usefind.find({fullname: req.query.searchuser}, (err, users) => {
//             if (err) {
//                 console.log('ERROL' + err.message);
//             } else {
//                 console.log('fullnamess' + users);
//                 res.render('friend', {users: users})
//             }
//         })
//     } else {
//         res.send(usefind);
//     }
//
// });
// app.get("/login_user", function (req, res) {
//     var usefind = db.model('users', user);
//     usefind.findOne({email: req.query.emailss, fullname: req.query.passwordss}, (err, users) => {
//         if (err) {
//             console.log('ERROL' + err.message);
//         } else {
//             if (users != undefined) {
//                 res.redirect('/friend');
//             } else {
//                 res.send("khong duoc roi")
//             }
//         }
//     })
// })
// app.get('/getUserList', upload, function (req, res) {
//     var usefind = db.model('users', user);
//     usefind.find({}, (err, users) => {
//         if (err) {
//             console.log('LOG ERROR' + err.message);
//         } else {
//             users.forEach(function (item) {
//             });
//             res.send(users);
//         }
//
//     })
// });
// app.get('/', function (req, res) {
//     res.render('form');
//
// });
// app.post('/insertUser', upload, function (req, res) {
//     var insert = db.model('user', user);
//     insert({
//         fullname: req.body.fullname,
//         email: req.body.email,
//         phone: req.body.phone,
//         andress: req.body.andress,
//         city: req.body.city,
//         street: req.body.street,
//         avatar: "yong.png",
//     }).save(function (err) {
//         if (err) {
//             console.log('đã lỗi ' + err.message)
//             res.send('đã lỗi rồi bạn ơi ' + err.message)
//         } else {
//             res.render('addprofile');
//         }
//     });
//
// });
// app.get('/appweb', function (req, res) {
//     res.render("friend", {layout: 'appweb'});
// });
// app.get('/login', function (req, res) {
//     res.render("login", {layout: 'main',});
//
// });
// app.get('/addprofile', function (req, res) {
//     res.render("addprofile", {layout: 'appweb'});
// });
// app.get('/delete/:id', function (req, res) {
//     var insert = db.model('user', user);
//     var id = req.params.id
//     insert.findByIdAndRemove(id, (err, user) => {
//         if (err) {
//             console.log("error: " + err.message);
//         } else {
//             res.redirect('/friend')
//         }
//     })
// })
// app.get('/update=:id', function (req, res) {
//     var insert = db.model('user', user);
//     insert.findById(req.params.id, function (err, user) {
//         if (err) {
//             console.log("đã lỗi " + err.message);
//         } else {
//             res.render('update', {update: user})
//         }
//     })
// })
// app.get('/test', upload, function (req, res) {
//     var usefind = db.model('users', user);
//     usefind.find({}, (err, users) => {
//         if (err) {
//             console.log('ERROL' + err.message);
//         } else {
//             users.forEach(function (item) {
//
//             });
//         }
//         res.render('test', {users: users})
//     })
// })
//
//
// app.post('/update=:id', upload, function (req, res) {
//     var insert = db.model('user', user);
//     insert.updateOne({_id: req.body.id}, {
//         fullname: req.body.fullname,
//         email: req.body.email,
//         phone: req.body.phone,
//         andress: req.body.andress,
//         city: req.body.city,
//         street: req.body.street,
//         avatar: 'yong.png',
//     }, function (err, user) {
//         if (err) {
//             console.log("đã lỗi " + err.message);
//         } else {
//             res.redirect("friend");
//         }
//     })
// })

app.listen(process.env.PORT || '3001', function () {
    console.log("Open PORT");
});

