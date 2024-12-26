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
exports.ReservationRepository = void 0;
class ReservationRepository {
    /**
     * Insere uma reserva no banco de dados
     * @param reservation
     */
    saveReservation(reservation, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO reservations (clientName, flightNumber, reservationDate) VALUES (?, ?, ?)`;
            const params = [
                reservation.clientName,
                reservation.flightNumber,
                reservation.reservationDate,
            ];
            try {
                yield connection.execute(query, params);
            }
            catch (error) {
                console.log("Erro ao salvar reserva:", error);
                throw new Error("Erro ao salvar reserva no banco de dados");
            }
        });
    }
}
exports.ReservationRepository = ReservationRepository;
