"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDbConnection = exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.db = promise_1.default.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '0102',
    database: process.env.MYSQL_DATABASE || 'flights',
});
// Função para verificar a conexão com o banco de dados
const checkDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield exports.db.query("SELECT 1");
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    }
    catch (error) {
        console.error("Erro ao conectar com o banco de dados:", error);
        process.exit(1);
    }
});
exports.checkDbConnection = checkDbConnection;
