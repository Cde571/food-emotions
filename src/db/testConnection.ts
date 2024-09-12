import { connectToDatabase } from './db';

async function testConnection() {
    try {
        const database = await connectToDatabase();
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Error testing connection:', error);
    }
}

testConnection();