const express = require('express')
const app = express()
const port = 3000
const users = [
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
        res.status(400).end()
        
    } else {
        res.json(users.slice(0, limit))
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

//모듈로 외부에도 쓸수 있도록 설정
module.exports = app
