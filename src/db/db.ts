// src/db.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db: any;

export async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db();
      console.log('Conectado a MongoDB');
    } catch (error) {
      console.error('Error conectando a MongoDB', error);
    }
  }
  return db;
}
