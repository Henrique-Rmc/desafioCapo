import { Flight } from "../models/Flight";
import { db } from "../config/config";

export class FlightRepository{
 
    async saveFlight(flight: Flight): Promise<void>{
        /**
        * Insere um voo no banco de dados.
        * @param flight Dados do voo.
        */
        const query = `
        INSERT INTO flights (flightNumber, origin, destination, departureTime, arrivalTime, capacity)
        VALUES (?, ?, ?, ?, ?, ?);`;
        const params = [
            flight.flightNumber,
            flight.origin,
            flight.destination,
            flight.departureTime,
            flight.arrivalTime,
            flight.capacity,
        ];
        try{
            await db.execute(query, params);
        }catch(error){
            console.error("Erro ao salvar voo:", error);
            throw new Error("Erro ao salvar voo no banco de dados.");            
        }
    }

}