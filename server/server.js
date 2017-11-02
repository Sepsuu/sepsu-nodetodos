const _               = require('lodash');
const express         = require('express');
const BodyParser      = require('body-parser');
const { ObjectID }    = require('mongodb');


var { mongoose }    = require('./db/mongoose.js');
var { Todo }        = require('./models/todo');
var { User }        = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(BodyParser.json());

function validate (id) {
    if (ObjectID.isValid(id)) {
        return true;
    }
    return false;
};

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

/**
 * post new todo
 */
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

/**
 * get todo by id
 */
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
    }).catch((err) => {
        res.status(400).send();
    });

});

/**
 * delete todo by id
 */
app.delete('/todos/:id', (req, res) => {

    if (!validate(req.params.id)) {return res.status(404).send();}

    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    });   
});

/**
 * update
 */
app.patch('/todos/:id', (req, res) => {
    var body = _.pick(req.body, ['text', 'completed']);

    // validate id
    if(!validate(req.params.id)) {return res.status(404).send();}

    if (_.isBoolean(body.completed) && body.completed) {
        // timestamp
        body.completedAt = new Date().getTime();
        
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true})
    .then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        
        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    })

});


app.listen(port, () => {
    console.log(`Up n running at port ${port}`);
});


module.exports = {app};