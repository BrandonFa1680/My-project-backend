const express = require('express')
const app = express()
const morgan = require('morgan')

let phoneBook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
    const id = phoneBook.length>0
        ? Math.max(...phoneBook.map( p => p.id))
        : 0
    return id+1
}

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', (req)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.json(phoneBook)
})

app.get('/api/info', (request, response) => {
    const date = new Date()
    response.send(`
    <p>Phonebook has info for ${phoneBook.length} people</p> 
    <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phoneBook.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneBook = phoneBook.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    const sameName = phoneBook.find(p => p.name === body.name)

    if(!body.number || !body.name) {
        return response.status(400).json({  
            error: 'name or number missing'
        })
    }

    if(sameName){
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        id: generateID(),
        name : body.name,
        number : body.number
    }

    phoneBook = phoneBook.concat(person)

    response.json(person)
})


const PORT = 3001
app.listen(PORT)    
console.log(`Server running on port ${PORT}`)