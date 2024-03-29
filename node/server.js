import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());
let userId = 125;

let database = {
    users: {
        "john@gmail.com": {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        "sally@gmail.com": {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    }
}
app.listen(3000, () => {
    console.log('app is running on port 3000');
})

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    try {
        const email = req.body.email;
        console.log(req.body);
        const password = req.body.password;
        if (database.users[email].password !== password) res.json("wrong credentials");
        res.json(`Welcome ${database.users[email].name}, you currently have ${database.users[email].entries} entries`);
    } catch (error) {
        res.json("user does not exist!");
    }
});

app.post('/register', (req, res) => {
    const {user, email, password} = req.body;
    if (user in database.users) res.json("username already exists");
    database.users[user] = {
        id: (userId + 1).toString(),
        name: user,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    };
    userId++;
    res.json(database.users[user]);
});

app.get('/profile/:userId', (req, res) => {
    const {userId}  = req.params;
    if (!(userId in database.users)) res.json("user does not exist");
    res.json(database.users[userId]);
});

app.put('/image', (req, res) => {
    const {user}  = req.body;
    if (!(user in database.users)) res.json("user does not exist");
    database.users[user].entries++;
    res.json(`count updated: ${user}'s count is now ${database.users[user].entries}`);
});