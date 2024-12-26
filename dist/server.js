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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const flight_routes_1 = require("./routes/flight_routes");
const config_1 = require("./config/config");
const dotenv_1 = __importDefault(require("dotenv"));
const reservation_routes_1 = require("./routes/reservation_routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/flight', flight_routes_1.flightRouter);
app.use('/reservation', reservation_routes_1.reservationRouter);
// Obtém a porta da variável de ambiente ou usa a 3000 como padrão
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica a conexão com o banco de dados quando o servidor iniciar
        yield (0, config_1.checkDbConnection)();
        console.log(`Servidor rodando na porta ${PORT}`);
    }
    catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1); // Encerra o servidor em caso de erro na conexão
    }
}));
