//GET /users отримати всіх юзерів
//POST /user зареєструвати юзера
//GET /users/:usersID Отримати одного
// PUT /users/:userId       оновити юезра
// DELETE /users/:userId  Видалити

//req.query зберігається всьо після ? в стрічці ?age=15 верне {age:15}
//Вам потрібно реалізувати мінімум 5 строрінок.
// 1) Реєстрація
// 2) Логінація.
// 3) Список всіх юзерів.
// 4) Інформація про одного юзера
// 5) Помилка
//
// Створити файл з юзерами, який буде виступати в ролі бази данних.
//
// При реєстрації юзер вводть мейл, нік та пороль і ви його данні дописуєте в файл.
// Але тільки якщо його немає ще. Якшо він є, то видаєте помилку. Після реєстрації переходите на сторінку зі
// всіма юзерми.
//
// При логінації юзер так само ввоить мейл та пароль і вам необхідно знайти його мейлик в списку юзерів та якщо такий мейлик з таким паролем є, то віддати інформацію про юзера. В інакшому випадку сказати, що необхідно реєструватись.
//
// І відображення всіх юзерів це відповідно просто виведення списку вісх юзерів.
//
// При реєстрації мейли не можуть повторюватись
const fs = require('fs');
const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const app = express();
app.listen(5000, () => {
    console.log('APP IS LISTENING')
});

//configuration code START===================
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));//вказав що в папці static всьо буде статичним вс зможуть їх отримувати
//конфігурим тімплейт двіжок
app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({
    defaultLayout: false //обов'язково передати такий параметр
}))
app.set('views', path.join(__dirname, 'static')) //тут вказується де вони лежать
//===CONFIG END===================

const users = []
app.get('/register', (req, res) => {
    res.render('register')
})

const pathToData = path.join(__dirname, 'fake-data-base.json')
app.post('/register', (req, res) => {
    const createdUser = req.body;
    fs.readFile(pathToData, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const parsedData = JSON.parse(data);
        console.log(parsedData, 'parsedData')
        console.log(createdUser, 'created');
        if (parsedData.some(el => el.email === createdUser.email)) {

            res.redirect('/error')
            return
        }
        users.push(createdUser);
        fs.writeFile(pathToData, JSON.stringify(users), err => {
            if (err) {
                console.log(err);
                return
            }
            res.redirect('/users')
        })
    })
})

app.get('/users', (req, res) => {
    res.render('users', {users})
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    fs.readFile(pathToData, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const parsedData = JSON.parse(data);
        const findedUser = parsedData.find(user => user.email === email && user.password === password);
        //findedUser то буде той шо ми ввели в логіні
        const index = parsedData.indexOf(findedUser);
        if (findedUser) {
            res.redirect(`/user/${index}`);
            return;
        }
        res.redirect('/register')
    })
})

app.get('/user/:id', (req, res) => {
    fs.readFile(pathToData, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const parsedData = JSON.parse(data);
        const chosen = parsedData[req.params.id];
        res.render('chosenUser', {chosen})
    })
})

app.get('/error', (req, res) => {
    res.render('error')
})
