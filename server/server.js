var express         = require('express');
var BodyParser      = require('body-parser');
var { ObjectID }    = require('mongodb');


var { mongoose }    = require('./db/mongoose.js');
var { Todo }        = require('./models/todo');
var { User }        = require('./models/user');

var app = express();

app.use(BodyParser.json());
/**
 * get all todos
 */
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        // send err back
        res.status(400).send(e);
    });
});

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    // validate id
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    };

    Todo.findById(req.params.id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});


app.listen(3000, () => {
    console.log('Started on port 3000');
});


module.exports = {app};