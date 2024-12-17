import { db } from "../config/config";
import { Reservation } from "../models/Reservation";

export class ReservationRepository{
    /**
     * Insere uma reserva no banco de dados
     * @param reservation 
     */
    async saveReservation(reservation: Reservation, connection: any): Promise<void> {
        const query = `INSERT INTO reservations (clientName, flightNumber, reservationDate) VALUES (?, ?, ?)`;
        const params = [
            reservation.clientName,
            reservation.flightNumber,
            reservation.reservationDate,
        ];
    
        try {
            await connection.execute(query, params);
        } catch (error) {
            console.log("Erro ao salvar reserva:", error);
            throw new Error("Erro ao salvar reserva no banco de dados");
        }
    }
}