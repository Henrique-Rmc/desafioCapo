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
exports.FlightService = void 0;
const flight_repository_1 = require("../repositories/flight_repository");
class FlightService {
    constructor(flightRepository) {
        this.flightRepository = flightRepository;
    }
    createFlight(flight) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!flight) {
                throw new Error('Vôo inválido');
            }
            try {
                const exists = yield this.flightRepository.existsByNumber(flight.flightNumber);
                if (exists) {
                    throw new Error("Já existe um vôo cadastrado com o Flight Number inserido");
                }
                yield this.flightRepository.saveFlight(flight);
                console.log(`Voo ${flight.flightNumber} criado com sucesso.`);
            }
            catch (error) {
                console.error("Erro ao criar o voo:", error);
                throw new Error("Erro ao criar o voo. Por favor, tente novamente.");
            }
        });
    }
    static getFlights(origin, destination, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const flights = yield flight_repository_1.FlightRepository.findByRouteAndDate(origin, destination, date);
                if (!flights || flights.length === 0) {
                    throw new Error("Nenhum voo encontrado para a rota e data especificadas.");
                }
                return flights;
            }
            catch (error) {
                console.error("Error in FlightService.getFlights:", error);
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error("Erro desconhecido ao buscar voos.");
                }
            }
        });
    }
    findFlightByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!number || number.trim() === "") {
                throw new Error("Número de vôo inválido");
            }
            try {
                const flight = yield this.flightRepository.findByNumber(number);
                if (!flight) {
                    throw new Error(`Voo com o número ${number} não foi encontrado.`);
                }
                return flight;
            }
            catch (error) {
                console.error("Erro ao buscar o voo:", error);
                throw new Error("Erro ao buscar informações do voo. Tente novamente mais tarde.");
            }
        });
    }
    existsByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!number) {
                throw new Error("Número de voo inválido.");
            }
            try {
                return yield this.flightRepository.existsByNumber(number);
            }
            catch (error) {
                console.error("Erro ao verificar a existência do voo:", error);
                throw new Error("Erro ao verificar a existência do número do voo.");
            }
        });
    }
}
exports.FlightService = FlightService;
