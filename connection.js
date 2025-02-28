const mysql = require('mysql2/promise');
 
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Fa@748512',
            database: 'todolist_db'
        });
        console.log('Connected to database');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}
 
async function insertData(connection, tableName, data, columnNames) {
    try {
        const query = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columnNames.map(() => '?').join(', ')})`;
 
        for (const row of data) {
            let values = columnNames.map(columnName => row[columnName]);
 
            values = values.map(value => value === undefined ? null : value);
 
            await connection.execute(query, values);
        }
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}
 
async function createTableSchema(connection, schema) {
    try {
       console.log("Executing SQL: ", schema);
       await connection.execute(schema);
       console.log("Table has created successfully ")
    } catch (error) {
       console.error("Error creating table:", error);
    }
 }
 
module.exports = { connectToDatabase, insertData, createTableSchema };