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
    async existsByNumber(number: string):Promise<boolean>{
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

    static async findByRouteAndDate(origin: string, destination: string, date: string): Promise<any> {
        const query = `
            SELECT * FROM flights
            WHERE origin = ? AND destination = ? AND DATE(departureTime) = ?
        `;
        const [rows]: any[] = await db.query(query, [origin, destination, date]);
        return rows;
    }

    async reserveSeat(flightNumber: string, connection: any): Promise<void | null> {
        const checkQuery = `SELECT * FROM flights WHERE flightNumber = ?;`;
        const updateQuery = `UPDATE flights SET capacity = capacity - 1 WHERE flightNumber = ? AND capacity > 0;`;
    
        try {
            const [rows]: any[] = await connection.execute(checkQuery, [flightNumber]);
    
            if (rows.length === 0) {
                console.log("Vôo não encontrado.");
                return null; 
            }
    
            const flight = rows[0];
    
            if (flight.capacity <= 0) {
                console.log("Sem assentos disponíveis.");
                return null;  
            }
    
            const [result]: any = await connection.execute(updateQuery, [flightNumber]);
    
            if (result.affectedRows === 0) {
                console.log("Falha em reservar assento. O voo pode estar lotado.");
                return null; 
            }
    
            console.log("Assento reservado com sucesso.");
            return null; 
        } catch (error) {
            console.error("Erro ao reservar assento:", error);
            throw error;  
        }
    }
    
    

}