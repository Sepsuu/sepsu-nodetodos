//const MongoClient = require('mongodb').MongoClient;
//derestructuring
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/nodeTodo', (err, db) => {
    if (err) {return console.log('Unable to connect db server')}

    console.log('Connected to MongoDB server yeye');

/*    db.collection('Todos').insertOne({
        text: 'Something todo',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo! :(');
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });*/

/*    db.collection('Users').insertOne({
        name: "Severi",
        age: 22,
        location: 'Tampere'
    }, (err, result) => {
        if (err) 
        {
            return console.log('Unable to insert user');
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });*/

    db.close();
});
