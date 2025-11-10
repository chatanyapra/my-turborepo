require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('Testing connection to Neon DB...');
        console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
        
        await client.connect();
        console.log('✅ Successfully connected to the database!');
        
        const result = await client.query('SELECT NOW()');
        console.log('Current database time:', result.rows[0].now);
        
        await client.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
    }
}

testConnection();
