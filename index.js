const XlsxReader = require("@tiburadev/tiburacorelibnode/excel-to-json/index.js");
const path = require('path');
const { connectToDatabase, insertData, createTableSchema } = require('./connection.js');
 console.log("Hello")
async function main() {
    try {
      const filePath = './users.xlsx';
      const fileName = path.basename(filePath, '.xlsx')
        const reader = new XlsxReader(filePath);
        const fullData = await reader.extractSheetMetaData('full');
        // console.log(fullData)
        const columnMetaData = fullData.columnMetaData;
        const dataRows = fullData.data;
 
        // console.log("Column Metadata:", columnMetaData);
        // console.log("Data Rows:", dataRows);
 
        dataRows.forEach(row => {
          // console.log("Row data ---> ",row)
          Object.keys(row).forEach(key => {
            console.log(key);
            const value = row[key];
            if (typeof value === 'object' && value !== null) {
              row[key] = JSON.stringify(value);
            } else if (typeof value === 'boolean') {
              row[key] = value ? 1 : 0;
            }
          });
        });
        // console.log("DataRows ",dataRows)
        const connection = await connectToDatabase();
        const tableName = fileName;
 
        await createTableSchema(connection, tableName, columnMetaData);
 
        const columnNames = columnMetaData.map(column => column.column_name);
 
        await insertData(connection, tableName, dataRows, columnNames);
 
        await connection.end();
    } catch (error) {
        console.error('Main error:', error);
    }
}
 
main();