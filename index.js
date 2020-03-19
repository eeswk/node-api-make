const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const app = express()

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text({ type: 'text/*' }))

const port = 3000
let users = [
    {id: 1, name: "Alice"}, 
    {id: 2, name: "Tomas"}, 
    {id: 3, name: "John"}
]

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/users', (req, res) => {    
    req.query.limit = req.query.limit || 10
    const limit = parseInt(req.query.limit, 10)
    //todo
    if(Number.isNaN(limit)) {
        return res.status(400).end()
        
    } else {
        return res.json(users.slice(0, limit))
    }    
    //res.json(users)
})

app.get('/users/:id', (req, res) => {
    //id값을 얻어낸다.    
    const id = parseInt(req.params.id)
        
    if (Number.isNaN(id)) {
        return res.status(400).end()
    }

    const user = users.filter(user => user.id === id)[0]
    if(user === undefined) {
        return res.status(404).end()
    }
         
    res.json(user)        
})

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)

    if(Number.isNaN(id)) {
        return res.status(400).end()
    }

    
    users = users.filter(user => user.id !== id)
    
    /*
    const user = users.filter(user => user.id === id)[0];
    if (user === undefined) {
        return res.status(400).end()
    }
    users.pop(user);
    */
    console.log(users);
    res.status(204).end()
    
})

app.post('/users', (req, res) => {
    //body-parser 사용해야함.
    const name = req.body.name    
    if (!name) {
        return res.status(400).end()
    }
    const found = users.filter(user => user.name === name).length
    if (found) {
        return res.status(409).end()
    }
    const id = Date.now()
    const user = {id, name}
    users.push(user)

    res.status(201).json(user)

})

app.post('/card', (req, res) => {
    const cardNumber = req.body
    console.log(cardNumber)  
    res.status(200)
    if (cardNumber === '1234') {
        return res.send('expired');
    } else if (cardNumber === '9999') {
        return res.send('theft');
    } else {
        res.send('ok')
    }

})





//모듈로 외부에도 쓸수 있도록 설정
module.exports = app
