// src/testConnection.ts
import { connectToDatabase } from './db';

async function testConnection() {
  try {
    const db = await connectToDatabase();
    // Verifica si la conexión a la base de datos se realizó correctamente
    const collections = await db.listCollections().toArray();
    console.log('Conexión exitosa a MongoDB');
    console.log('Colecciones en la base de datos:', collections);
  } catch (error) {
    console.error('Error en la conexión a MongoDB:', error);
  }
}

testConnection();
