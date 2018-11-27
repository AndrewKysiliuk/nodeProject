const DataBase = require('./DataBase');
const cors = require('cors');
const express = require('express');

const app = express();
const port = 3000;
const base = new DataBase();

app.use(cors());
app.use(express.json());

app.get('/home/:key', (req, res) => {  // отримуємо список категорій
    base.getData(req.params.key).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );

});
app.get('/home/:key/:category', (req, res) => { // отримуємо масив категорій
    base.getData(req.params.key, req.params.category).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );

});
app.get('/home/:key/:category/:id', (req, res) => {// отримуємо запис по id з вказаної категорії
    base.getData(req.params.key, req.params.category, req.params.id).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );

});

app.post('/authorization', (req, res) => {
    base.authorization(req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(401).send(JSON.stringify(reject))
    );
});
app.post('/registration', (req, res) => {
    base.registration(req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(401).send(JSON.stringify(reject))
    );
});

app.post('/home/:key/:category', (req, res) => {
    base.post(req.params.key, req.params.category, req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(404).send(JSON.stringify(reject)));
});

app.put('/home/:key/:category/:id', (req, res) =>{
    base.put(req.params.key, req.params.category, req.params.id, req.body).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject));
});

app.delete('/home/:key/:category/:id', (req, res) =>{
    base.del(req.params.key, req.params.category, req.params.id).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject));
});

app.listen(port, console.log(`Server on port ${port} is start`));

