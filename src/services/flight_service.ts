import { Flight } from "../models/Flight";
import { FlightRepository } from "../repositories/flight_repository";


export class FlightService{
    
    constructor(private flightRepository: FlightRepository) {}

    async createFlight(flight: Flight): Promise<void>{
        if(!flight){
            throw new Error('Vôo inválido')
        }
        try {
            await this.flightRepository.saveFlight(flight);
            console.log(`Voo ${flight.flightNumber} criado com sucesso.`);
        } catch (error) {
            console.error("Erro ao salvar o voo:", error);
            throw new Error("Erro ao criar o voo. Por favor, tente novamente.");
        }
        
    }

    static async getFlights(origin: string, destination: string, date: string): Promise<any> {
        try {
            return await FlightRepository.findByRouteAndDate(origin, destination, date);
        } catch (error) {
            throw new Error("Error while fetching flights");
        }
    }

    async findFlightByNumber(number: string): Promise<Flight | null> {
        if (!number || number.trim() === "") {
            throw new Error("Número de vôo inválido");
        }
        try {
            const flight = await this.flightRepository.findByNumber(number);
    
            if (!flight) {
                throw new Error(`Voo com o número ${number} não foi encontrado.`);
            }
    
            return flight;
        } catch (error) {
            console.error("Erro ao buscar o voo:", error);
            throw new Error("Erro ao buscar informações do voo. Tente novamente mais tarde.");
        }
    }

    async existsByNumber(number: string): Promise<boolean> {
        if (!number) {
            throw new Error("Número de voo inválido.");
        }
    
        try {
            return await this.flightRepository.existsByNumber(number);
        } catch (error) {
            console.error("Erro ao verificar a existência do voo:", error);
            throw new Error("Erro ao verificar a existência do número do voo.");
        }
    }
}

