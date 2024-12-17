import { Flight } from "../models/Flight";
import { FlightRepository } from "../repositories/flight_repository";


export class FlightService{
    
    constructor(private flightRepository: FlightRepository) {}

    async createFlight(flight: Flight): Promise<void>{
        if(!flight){
            throw new Error('Vôo inválido')
        }
        await this.flightRepository.saveFlight(flight);
        
    }
}

