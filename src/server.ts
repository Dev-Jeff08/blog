import express from 'express';
const app = express();
import { data } from '../secure/app';
import * as path from 'path';
import cors from 'cors';
import { v4 } from 'uuid';
import session from 'express-session';
import bcrypt from 'bcrypt';
import User from './schema/userSchema';
import db from 'mongoose'

declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
    }
}
  

app.use(cors());

db.connect(String(data[2].mongodbKey))

app.set("views", path.join(__dirname, "./public"));
app.set("view engine", "pug");

app.use('/public', express.static(__dirname + "/public"));

app.use(session({
    secret: "@#!@#$!%!#@!@ %^^!@#$",
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req: express.Request, res: express.Response) => {
    res.render('home');
})

app.post('/auth/register', (req: express.Request, res: express.Response) => {
    const { user_email, user_password } = req.body;

    const id = v4()

    const user = new User({
        id: id,
        email: user_email,
        password: user_password
    });

    user.save();

    return res.sendStatus(200);
});

app.post('/auth/signin', (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    

    if (!req.session.user) {
        User.find({email: email}, (err: string, docs: any) => {

            const isPasswordRight = bcrypt.compareSync(password, docs[0].password);
    
            if (isPasswordRight == true) {
                req.session.user = {
                    id: docs[0].id,
                    email: docs[0].email,
                    password: docs[0].password
                };

                req.session.save(() => {
                    res.sendStatus(200)
                })
  
            };
            
        });
    };



});

app.put('/auth/signout', (req: express.Request, res: express.Response) => {
    if (!req.session.user) {
        res.sendStatus(500);
    } else {
        req.session.destroy(() => {
            req.session;
        });

        res.sendStatus(200);
    };
})

app.get('/auth/', (req: express.Request, res: express.Response) => {
    if (req.session.user) {
        res.send({ isUserSignedIn: true });
    } else {
        res.send({ isUserSignedIn: false });
    };
});

app.post('/auth/email', (req: express.Request, res: express.Response) => {

})

app.listen(data[0].port, () => {
    console.log(`Your server is running on ${data[0].port}`);
    console.log(`http://localhost:${data[0].port}`)
})