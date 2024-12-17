import { Flight } from "../models/Flight";
import { db } from "../config/config";
import { flightSchema } from "../schemas/flight_schema";

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
    async findByNumber(number: string):Promise<Flight | null>{
        /**
        * Busca um Vôo no banco de dados pelo numero
        * @param number Dados do voo.
        */  
       const query =`SELECT *
                    FROM flights
                    WHERE flightNumber = ?;`
        try{const [rows]: any[] = await db.query(query, [number])
            if(rows.lenght === 0){
                return null
            }
            const data = rows[0]
            const flight = flightSchema.parse(data)
            console.log("Vôo encontrado:" , flight)
            return flight;
        }catch (error){
            console.error("Erro Ao buscar um vôo com nesse parametro", error)
            throw new Error("Erro ao Buscar Vôo")
        }

    }
    async existsByNumber(number: string):Promise<Boolean>{
        /**
        * Busca um Vôo no banco de dados pelo numero
        * @param number Dados do voo.
        */  
       const query =`SELECT *
                    FROM flights
                    WHERE flightNumber = ?;`

        try{const [rows]: any[] = await db.query(query, [number])
            if(rows.lenght === 0){
                return false
            }
            console.log("Vôo encontrado:")
            return true;
        }catch (error){
            console.error("Erro Ao buscar um vôo com nesse parametro", error)
            throw new Error("Erro ao Buscar Vôo")
        }

    }

}