
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://dbUser:qlalfqjsgh1@cluster0.8t5vr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

module.exports = client