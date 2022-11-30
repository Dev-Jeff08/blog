import express from 'express';
const app = express();
import { data } from '../secure/app';
import * as path from 'path';
import cors from 'cors';
import { v4 } from 'uuid';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { User } from './schema/userSchema';
import db from 'mongoose'
import { dbKey } from '../secure/app';
import bodyParser from 'body-parser';

declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
    }
}
  
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

db.connect(dbKey)
.then(() => {
    console.log('db connected!');
})

app.set("views", path.join(__dirname, "./public"));
app.set("view engine", "pug");

app.use('/public', express.static(__dirname + "/public"));

app.use(session({
    secret: "@#!@#$!%!#@!@ %^^!@#$",
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req: express.Request, res: express.Response) => {
    res.render('home')
})

app.get('/user/signin', (req: express.Request, res: express.Response) => {
    res.render('signin')
})

app.post('/auth/register', (req: express.Request, res: express.Response) => {
    const { email, password } = req.body

    const id = v4()

    const user = new User({
        id: id,
        email: email,
        password: password
    });

    user.save(() => {
        res.send({ status: 200 })
    })
});


app.post('/auth/signin', (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
 
    if (!req.session.user) {
        User.find({email: email}, (err: string, docs: any) => {

            const userId = docs[0].id;
            const userEmail = docs[0].email;
            const userPassword = docs[0].password

            const isPasswordRight = bcrypt.compareSync(password, userPassword);
    
            if (isPasswordRight == true) {
                req.session.user = {
                    id: userId,
                    email: userEmail,
                    password: userPassword
                };

                req.session.save(() => {
                    res.send({ status: 200 })
                })
  
            };
            
        });
    };



});

app.put('/auth/signout', (req: express.Request, res: express.Response) => {
    if (!req.session.user) {
        res.send({ status: 500 });
    } else {
        req.session.destroy(() => {
            req.session;
        });

        res.send({ status: 200 });
    };
})

app.get('/auth/', (req: express.Request, res: express.Response) => {
    if (!req.session.user) {
        res.send({ isUserSignedIn: false });
    } else {
        res.send({ isUserSignedIn: true });
    };
});

app.post('/auth/email', (req: express.Request, res: express.Response) => {

})

app.listen(data[0].port, () => {
    console.log(`Listen your server in http://localhost:${data[0].port}/`);
})