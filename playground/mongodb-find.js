//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/nodeTodo', (err, db) => {
    if (err) {return console.log('Unable to connect db server')}

    console.log('Connected to MongoDB server yeye');

    /*db.collection('Todos').find({_id: ObjectID('59ee58124c54d82020355bfd')}).toArray()
    .then((doc) => {
        console.log('Todos');
        console.log(JSON.stringify(doc, undefined, 2));
    }, (err) => {
        console.log('Unable to fect todos', err);
    })*/
    /*db.collection('Todos').find().count()
    .then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log(`Unable to fetch todos ${err}`);
    });*/

    db.collection('Users').find({name: 'Severi'}).toArray()
    .then((docs) => {
        console.log(docs, undefined, 2);
    });


    //db.close();
});
