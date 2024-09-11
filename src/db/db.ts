import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}