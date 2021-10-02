const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { fakeDB } = require('./fakeDB.js');
const {  compare } = require('bcryptjs');

const app = express();
const port = 5000;

let users = [];



app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (user) throw new Error('User already exist');
    fakeDB.push({
      id: fakeDB.length,
      email,
      password:password ,
    });

    res.send("1");
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});







app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (!user) throw new Error('User does not exist');
    const valid = fakeDB.find(valid => valid.password === password);
    if (!valid) throw new Error('Password not correct');
    res.send("1");
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});








// app.post('/user', (req, res) => {
//     const user = req.body;

//     console.log(user);
//     users.push(user);


//     res.send("done")



//     fs.appendFile('FakeDataBase.js', JSON.stringify(users), (err) => {
//         if (err) throw err;
    
//         console.log('saved to database!');
//     });
    

    
// });


app.get('/users', (req, res) => {

      res.send(fakeDB)


    // fs.readFile(__dirname + "/FakeDataBase.js", (error, data) => {
    //     if(error) {
    //         throw error;
    //     }
         
    //     res.json(data.toString());
    // });



    
});











app.listen(port, () => console.log(`Backend Started ${port}!`))
