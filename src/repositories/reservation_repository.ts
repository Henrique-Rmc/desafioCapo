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
    /**
     * 
     * @param userName 
     * @returns 
     */
    async findReservationsByUserName(userName: string): Promise<any[] | null> {
        /**
         * Busca reservas no banco de dados pelo nome do usuário.
         * @param userName Nome do usuário.
         */
        const query = `
            SELECT * 
            FROM reservations
            WHERE clientName LIKE ?;
        `;
    
        try {
            const [rows]: any[] = await db.query(query, [`%${userName}%`]);
            
            if (rows.length === 0) {
                console.log("Nenhuma reserva encontrada para o usuário:", userName);
                return null;
            }
    
            console.log("Reservas encontradas:", rows);
            return rows;
        } catch (error) {
            console.error("Erro ao buscar reservas para o usuário:", error);
            throw new Error("Erro ao buscar reservas no banco de dados.");
        }
    }
    

}