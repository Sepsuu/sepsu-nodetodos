const   expect      = require('expect'),
        request     = require('supertest'),
        {ObjectID}  = require('mongodb');

const { app }       = require('./../server');
const { Todo }      = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: "Test todo"
},{
    _id: new ObjectID(),
    text: "Another test todo",
    completedAt: 333
}];

// before testcase removeAll from db n add some dummydata
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    // case 1
    it('should create a new todo', (done) => {
        var text = 'test txt';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });


    // case 2
    it('If invlid data, todo should not be created', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // validate that db is empty
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));

            });
    });
});

// test GET route
describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('404 todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123123')
        .expect(404)
        .end(done)
    });

});

describe('delete todo', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // verify that id does not exist
                Todo.findById(id).then((todo) => {
                    expect(todo).not.toBe();
                    done();
                }).catch((err) => done(err));
            });
    });
    
    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

    it('Should return 404 objectId is invalid', (done) => {
        request(app)
            .delete('/todos/123asd')
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'This is a new text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text: text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                // expect to be a number ei toimi fuufuu

            })
            .end(done);
    });

    it('Clear compltetedAt when not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = 'This is a new text123!!';
        
                request(app)
                    .patch(`/todos/${id}`)
                    .send({
                        completed: false,
                        text
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.todo.text).toBe(text);
                        expect(res.body.todo.completed).toBe(false);
                        expect(res.body.todo.completedAt).toBe(null);
        
                    })
                    .end(done);
    });
});