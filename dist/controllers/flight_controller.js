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
exports.FlightController = void 0;
const flight_schema_1 = require("../schemas/flight_schema");
const flight_service_1 = require("../services/flight_service");
class FlightController {
    constructor(flightService) {
        this.flightService = flightService;
    }
    createFlightHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const validatedData = flight_schema_1.flightSchema.parse(data);
                console.log(validatedData);
                yield this.flightService.createFlight(validatedData);
                res.status(201).json({ message: "Voo criado com sucesso" });
            }
            catch (error) {
                if (error.name === "ZodError") {
                    res.status(400).json({
                        error: "Dados inválidos.",
                        details: error.errors.map((e) => ({
                            path: e.path,
                            message: e.message
                        }))
                    });
                }
                else {
                    res.status(500).json({
                        error: error.message || "Erro interno do servidor."
                    });
                }
            }
        });
    }
    getFlightHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const origin = decodeURIComponent(req.query.origin);
                const destination = decodeURIComponent(req.query.destination);
                const date = req.query.date;
                const flightParams = flight_schema_1.findflightSchema.parse({
                    origin,
                    destination,
                    departureTime: date
                });
                const flights = yield flight_service_1.FlightService.getFlights(flightParams.origin, flightParams.destination, flightParams.departureTime);
                res.status(200).json(flights);
            }
            catch (error) {
                console.error("Error in getFlightHandler:", error);
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message }); // Resposta detalhada para erros conhecidos
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" }); // Erro genérico para outros casos
                }
            }
        });
    }
}
exports.FlightController = FlightController;
