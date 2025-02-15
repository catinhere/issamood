const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
module.exports.bcrypt = bcrypt;

let User = require('./models/User');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials",true);
    next();
  });

app.use(cors({
    origin: ['http://localhost:3000'],
    methods:['GET','POST', 'PUT', 'DELETE'],
    credentials: true, // enable set cookie,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
}));

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log("MongoDB connection established successfully.");
// });

/* Setup Passport */
app.use(flash())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Username does not exist.' });
        }

        bcrypt.compare(password, user.password, (err, res) => {
            if (err) { return done(err); }
            if (!res) {
                return done(null, false, { message: 'Incorrect password.' });
            } else {
                const token = jwt.sign(res, 'your_jwt_secret');
                return done(null, {user, token});
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.user.id);
  });
  
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.get('/', function (req, res) {
    res.send('hello world')
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });
        req.login(user, {}, function(err) {
            if (err) { return next(err) };
            req.session.save(function(){
                return res.json(user);
            });
            
        });
    })(req, res, next);
})

app.get('/logout', (req, res) => {
    req.logout();
    return res.status(200).json({ message: "Successfully logged out" })
});

/* Routes */
const usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const commentsRouter = require('./routes/comments');
const boardsRouter = require('./routes/boards');
const boardRouter = require('./routes/board');

app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/comments', commentsRouter);
app.use('/boards', boardsRouter);
app.use('/board', boardRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});