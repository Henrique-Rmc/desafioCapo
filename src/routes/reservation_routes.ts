import { Router } from "express"
import { ReservationController } from "../controllers/reservation_controller"
import { FlightRepository } from "../repositories/flight_repository"
import { ReservationRepository } from "../repositories/reservation_repository"
import { ReservationService } from "../services/reservation_service"
import { flightRouter } from "./flight_routes"

const reservationRouter = Router()
const flight_repository = new FlightRepository()
const reservation_repository = new ReservationRepository()
const reservation_service = new ReservationService(reservation_repository, flight_repository)
const reservationController = new ReservationController(reservation_service)



reservationRouter.post("/create", async(req, res)=>{
    try{
        await reservationController.createReservationHandler(req, res)
    }catch(error){
        console.log("Erro ao acessar rota de criar reserva")
        res.status(500).json({ error: "Erro interno do servidor." });
    }
})

export {reservationRouter}