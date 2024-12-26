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
exports.ReservationService = void 0;
const config_1 = require("../config/config"); // mysql2 Pool
class ReservationService {
    constructor(reservationRepo, flightRepository) {
        this.reservationRepo = reservationRepo;
        this.flightRepository = flightRepository;
    }
    createReservation(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation) {
                throw new Error('Reserva Inválida');
            }
            const exist = yield this.flightRepository.existsByNumber(reservation.flightNumber);
            if (!exist) {
                throw new Error("Número de Vôo inválido");
            }
            const connection = yield config_1.db.getConnection();
            yield connection.beginTransaction();
            try {
                yield this.flightRepository.reserveSeat(reservation.flightNumber, connection);
                yield this.reservationRepo.saveReservation(reservation, connection);
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                console.log("Não foi possível criar uma reserva", error);
                throw new Error("Erro ao salvar reserva no banco de dados");
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.ReservationService = ReservationService;
