import { Reservation } from "../models/Reservation";
import { FlightRepository } from "../repositories/flight_repository";
import { ReservationRepository } from "../repositories/reservation_repository";


export class ReservationService{
    constructor(private reservationRepo: ReservationRepository, private flightRepository: FlightRepository){}

    async createReservation(reservation: Reservation): Promise<void>{
        if(!reservation){
            throw new Error('Reserva Invalida')
        }
        const exist = await this.flightRepository.existsByNumber(reservation.flightNumber)
        if(!exist){
            throw new Error("Número de Vôo inválido")
        }
        try{
            await this.reservationRepo.saveReservation(reservation)
        }catch(error){
            console.log("Não foi possível criar uma reserva", error)
            throw new Error("Erro ao salvar reserva no banco de dados")
        }
        

    }
}