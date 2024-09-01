// src/db.ts
import { MongoClient } from 'mongodb';

// Asegúrate de que el URI esté definido en tus variables de entorno
const uri = process.env.MONGODB_URI as string;

// Crear una instancia de MongoClient
const client = new MongoClient(uri, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db: any;

// Función para conectar a la base de datos
export async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      // Obtén la base de datos especificada en la URI o usa la predeterminada
      db = client.db(); // Puedes especificar un nombre de base de datos aquí si lo prefieres
      console.log('Conectado a MongoDB');
    } catch (error) {
      console.error('Error conectando a MongoDB', error);
    }
  }
  return db;
}
