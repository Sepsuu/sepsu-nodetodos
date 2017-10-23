//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/nodeTodo', (err, db) => {
    if (err) {return console.log('Unable to connect db server')}

    console.log('Connected to MongoDB server yeye');

    /*db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    });*/

    /*db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
        console.log(result);
    });*/

    db.collection('User').deleteMany({name: 'Severi'});

    db.collection('User').findOneAndDelete({
        _id: new ObjectID("59ee592464de8f237ce0e5b9")
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });

});
