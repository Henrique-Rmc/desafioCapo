import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",       // Host do MySQL
  user: "root",            // Usuário
  password: "sua_senha",   // Senha
  database: "reservas",    // Nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,     // Limite de conexões simultâneas
  queueLimit: 0,
});
