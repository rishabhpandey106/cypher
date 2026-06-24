const mongoose = require('mongoose');

async function checkDb() {
  await mongoose.connect('mongodb://jaiyaxh:PMKIk3XNyh3GBJqp@ac-xpplqxo-shard-00-00.abmtknx.mongodb.net:27017,ac-xpplqxo-shard-00-01.abmtknx.mongodb.net:27017,ac-xpplqxo-shard-00-02.abmtknx.mongodb.net:27017/cyphertest?ssl=true&replicaSet=atlas-m7a5yc-shard-0&authSource=admin&appName=todoapp&retryWrites=true&w=majority');
  
  const db = mongoose.connection.useDb('cyphertest');
  const collection = db.collection('users');
  
  const testingUser = await collection.findOne({ username: 'testing' });
  console.log("User 'testing':", !!testingUser);
  
  const rishabhUser = await collection.findOne({ username: 'rishabh' });
  console.log("User 'rishabh':", !!rishabhUser);
  
  process.exit(0);
}

checkDb();
