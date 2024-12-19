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
exports.reservationRouter = void 0;
const express_1 = require("express");
const reservation_controller_1 = require("../controllers/reservation_controller");
const flight_repository_1 = require("../repositories/flight_repository");
const reservation_repository_1 = require("../repositories/reservation_repository");
const reservation_service_1 = require("../services/reservation_service");
const reservationRouter = (0, express_1.Router)();
exports.reservationRouter = reservationRouter;
const flight_repository = new flight_repository_1.FlightRepository();
const reservation_repository = new reservation_repository_1.ReservationRepository();
const reservation_service = new reservation_service_1.ReservationService(reservation_repository, flight_repository);
const reservationController = new reservation_controller_1.ReservationController(reservation_service);
reservationRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield reservationController.createReservationHandler(req, res);
    }
    catch (error) {
        console.log("Erro ao acessar rota de criar reserva");
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}));
