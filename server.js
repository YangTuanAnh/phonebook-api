const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const PORT = 3001

app.use(express.json())
app.use(morgan('tiny'))
morgan.token("data", (req, res) =>
{
    const { body } = req;

    return JSON.stringify(body);
});
var phonebook = [
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
app.get('/api/persons', (req, res) =>
{
    res.json(phonebook)
})
app.get('/info', (req, res) =>
{
    res.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${new Date}</p>`
    )
})
app.get('/api/persons/:id', (req, res) =>
{
    const person = phonebook.find(person => req.params.id == person.id)
    if (person)
    {
        res.json(person)
    } else res.status(404).end()
})
app.delete('/api/persons/:id', (req, res) =>
{
    phonebook = phonebook.filter(person => Number(req.params.id) != person.id)
    res.status(204).end()
})
app.post('/api/persons', (req, res) =>
{
    const note = req.body
    if (!note.name || !note.number)
    {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    phonebook.map(person =>
    {
        if (person.name == note.name)
            return res.status(400).json({
                error: 'name must be unique'
            })
    })
    note.id = Math.round(Math.random() * 100000 + 1)
    phonebook = phonebook.concat(note)
    console.log(note)
    res.json(note)
})
app.listen(PORT, () =>
{
    console.log(`Listening at port ${PORT}`)
})