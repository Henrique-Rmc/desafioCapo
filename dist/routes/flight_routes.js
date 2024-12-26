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
Object.defineProperty(exports, "__esModule", { value: true });
exports.flightRouter = void 0;
// Arquivo de rotas (flight_routes.ts)
const express_1 = require("express");
const flight_controller_1 = require("../controllers/flight_controller");
const flight_service_1 = require("../services/flight_service");
const flight_repository_1 = require("../repositories/flight_repository");
const flightRouter = (0, express_1.Router)();
exports.flightRouter = flightRouter;
const flightRepository = new flight_repository_1.FlightRepository();
const flightService = new flight_service_1.FlightService(flightRepository);
const flightController = new flight_controller_1.FlightController(flightService);
/**
 * Cria um voo
 */
flightRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield flightController.createFlightHandler(req, res);
    }
    catch (error) {
        console.error("Erro ao acessar rota de criar voo:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}));
/**
 * resgata voos disponiveis para uma rota e data
 * GET /flights?origin={origin}&destination={destination}&date={date}
 */
flightRouter.get("/flights", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield flightController.getFlightHandler(req, res);
    }
    catch (error) {
        console.error("Erro ao encontrar os vôos selecionados:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}));
