import { reservationSchema } from "../schemas/reservation_schema";
import { FlightService } from "../services/flight_service";
import { Request, Response } from "express";
import { ReservationService } from "../services/reservation_service";



export class ReservationController{
    constructor(private reservationService: ReservationService){}

    async createReservationHandler(req: Request, res: Response): Promise<void>{
        try{
            const data = req.body
            const validatedData = reservationSchema.parse(data)
            console.log(validatedData)
            await this.reservationService.createReservation(validatedData)
            res.status(201).json({ message: "Reserva criado com sucesso" });
        }catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                error: "Dados inválidos.",
                details: error.errors.map((e: any) => ({
                    path: e.path,
                    message: e.message
                }))
            });
        } else {
            res.status(500).json({
                error: error.message || "Erro interno do servidor."
            });
        }
    }
}
}