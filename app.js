//Middleware, Get Endpoint, Post Endpoint, Start the server

const express = require('express');
const app = express();
const port = 3600;

app.use(express.json());    //Middleware


const personList = [        //Array
    {id:1, name:'Deeptha'},
    {id:2, name:'Sanju'},
    {id:3, name:'Sree'},
    {id:4, name:'Sachin'},
    {id:5, name: 'Narayana'}
]

app.get('/api/personList', (req, res) => {  //Get Endpoint
    res.json(personList);
});

app.post('/api/personList', (req, res) => {     //Post Endpoint
    const personNameList = {
        id: personList.length + 1,
        name: res.body.personList
    };

    personList.push(personNameList);
    res.status(201).json(personNameList);

});

app.listen(port, () => {
    console.log(`Port Running at ${port}`);
})