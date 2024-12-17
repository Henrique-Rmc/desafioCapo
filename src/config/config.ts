import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '0102',
    database: process.env.MYSQL_DATABASE || 'flights',
});

// Função para verificar a conexão com o banco de dados
export const checkDbConnection = async () => {
    try {
        const [rows] = await db.query("SELECT 1");
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    } catch (error) {
        console.error("Erro ao conectar com o banco de dados:", error);
        process.exit(1); 
    }
};
