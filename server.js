const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { notify } = require('../session_auth/routes/mainRoutes');

// Express built-in middleware. 
// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());  

// This is just a simple structure simulating a 'dummy' dababase.
const db_users = [ 
  // ex:  { name : 'alice', password: '123' }, 
  // ex:  { name : 'bob', password: '321' } 
]

app.get('/', (req, res) => { 
    res.send('Hello!!'); 
});

app.get('/users', ( req, res ) => { 
    console.log(req.headers);
    res.json(db_users)
});

app.post('/users/register', async (req, res) => {
    console.log(req.headers);

    // check if user is already in the db 
    const user = db_users.find(user => user.name == req.body.name);
    // if so, refuse the request
    if (user != null){
        return res.status(400).send('User already exists');
    }
    // if not, hashes the password and store it in the 'db' 
    try{
        const hashedPassword =  await bcrypt.hash(req.body.password, 14);
        const newuser = { name: req.body.name , password: hashedPassword }
        db_users.push(newuser);
        res.status(201).send();
    } catch {
        res.status(500).send();
    } 
});

app.post('/users/login', async(req, res) => {

    // checks if user is in the db
    const user = db_users.find(user => user.name == req.body.name);

    if (user == null){
        return res.status(400).send('Cannot find user');
    }

    try{
        // compares receveid password with password in the db
        if(await bcrypt.compare(req.body.password , user.password)){
            res.send('You are logged in');
        }else{
            res.send('You are not allowed')
        }
    }
    catch{
        res.status(500).send();
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));