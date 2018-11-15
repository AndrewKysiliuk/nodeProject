const DataBase = require('./DataBase');
const cors = require('cors');
const express = require('express');

const app = express();
const port = 3000;
const base = new DataBase();

// app.use((req, res, next) =>{
//     res.header('Access-Control-Allow-Origin','*');
//     next();
// });
app.use(cors());
app.use(express.json());

app.get('/gallery', (req, res) => {
    base.get().then(resolve => res.status(200).send(resolve));
});
app.get('/gallery/:id', (req, res) => {
    base.get(req.params.id).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send({})
    );
});

app.post('/gallery', (req, res) => {
    base.post(req.body).then(() => res.status(200).send({}));
});

app.put('/gallery/:id', (req, res) =>{
    base.put(req.body).then(
        resolve => res.status(200).send(),
        reject =>{
            res.status(404).send();
            console.log('Error item not found!');
        });
});


app.delete('/gallery/:id', (req, res) =>{
    base.del(req.params.id).then(
        resolve => res.status(200).send(resolve),
        reject => {
            res.status(404).send();
            console.log(`Error item not found`);
        });
});



app.listen(port, console.log(`Server on port ${port} is start`));

