const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const  cors = require('cors')
const fs = require('fs');

dotenv.config();
app.use(bodyParser.json());
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }
 app.use(cors(corsOptions));



 //Thao tác đối với mảng dữ liệu các đối tượng có thể dùng map, for loop hoặc cá hàm của array như findIndex....
 const checkEmail = (jsonObj, email) => {
    for (const account of jsonObj) {
        if (email === account.email) {
            return false;
        }
    }
 }


app.post('/login', async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'))
    for (const account of jsonObj) {
        if (email === account.email) {
            if(account.password === password.toString()) {
                res.send("Login successful");
            }else{
                res.send("Login failed. Password is incorrect") 
            }
            break;
        }
    }
    
 });

app.post('/signin', function(req, res){
    var email = req.body.email; 
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'));
    if(checkEmail(jsonObj, email) == false){
        res.send("The Email was registered")
    }else{
        var newData = req.body;
        newData.todolist = [];
        jsonObj.push(newData);
        fs.writeFile("account.json", JSON.stringify(jsonObj), (err) => {
            if (err) throw err;
            res.send("Signin successful");
          });
    }
 });

app.post('/gettodo', (req, res) => {
    var email = req.body.email;
    console.log(email);
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'));
    //USE MAP FUNCTION
    // jsonObj.map(function (value, key) {
    //     if(email === value.email)
    //         console.log(jsonObj[key].todolist)
    // });
    for (const account of jsonObj) {
        if (email === account.email) {
            res.send(account.todolist);
            break;
        }
    }
})


app.post('/addtodo', function (req, res) {
    var email = req.body.email;
    var newTodolist = req.body.todolist;
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'));
    objIndex = jsonObj.findIndex((obj => obj.email === email));
    jsonObj[objIndex].todolist.push(newTodolist[0]);
    fs.writeFile("account.json", JSON.stringify(jsonObj), (err) => {
        if (err) throw err;
        res.send("Added successful");
      });
})


app.post("/edittodo", (req, res) => {
    var email = req.body.email;
    var index = req.body.index;
    var title = req.body.title;
    var content = req.body.content;
    var status = req.body.status;
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'));
    objIndex = jsonObj.findIndex((obj => obj.email === email));
    jsonObj[objIndex].todolist[index].title = title;
    jsonObj[objIndex].todolist[index].content = content;
    jsonObj[objIndex].todolist[index].status = status;
    fs.writeFile("account.json", JSON.stringify(jsonObj), (err) => {
        if (err) throw err;
        res.send("Change successful");
      });

});


app.post("/deletetodo", (req, res) => {
    var email = req.body.email;
    var index = req.body.index;
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'));
    objIndex = jsonObj.findIndex((obj => obj.email === email));
    jsonObj[objIndex].todolist.splice(index,1);
    fs.writeFile("account.json", JSON.stringify(jsonObj), (err) => {
        if (err) throw err;
        res.send("Delete successful");
      });
});


app.post("/deleteaccount", (req, res) => {
    var email = req.body.email;
    var jsonObj = JSON.parse(fs.readFileSync("account.json", 'utf8'));
    objIndex = jsonObj.findIndex((obj => obj.email === email));
    jsonObj.splice(objIndex, 1);
    fs.writeFile("account.json", JSON.stringify(jsonObj), (err) => {
        if (err) throw err;
        res.send("Delete successful");
      });
})

const PORT = 8080;
app.listen(PORT, () => console.log(`Server starting in ${PORT}`));