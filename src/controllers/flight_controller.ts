import { findflightSchema, flightSchema } from "../schemas/flight_schema";
import { Request, Response } from "express";
import { FlightService } from "../services/flight_service";
import { Flight } from "../models/Flight";

export class FlightController {
    constructor(private flightService: FlightService) {}

    async createFlightHandler(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;

            const validatedData = flightSchema.parse(data)
            console.log(validatedData)
            await this.flightService.createFlight(validatedData);

            res.status(201).json({ message: "Voo criado com sucesso" });

        } catch (error: any) {
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

    async getFlightHandler(req: Request, res: Response): Promise<void> {
        try{
            const origin = decodeURIComponent(req.query.origin as string);
            const destination = decodeURIComponent(req.query.destination as string);
            const departureTime = req.query.date as string;
            console.log(origin)
            console.log(destination)
            // const flightParams = findflightSchema.parse({
            //     origin,
            //     destination,
            //     departureTime
            // })
            
            // const flights = await FlightService.getFlights(
            //     flightParams.origin,
            //     flightParams.destination,
            //     flightParams.departureTime
            // )
            const flights = await FlightService.getFlights(
                origin,
                destination,
                departureTime
            )
            res.status(200).json(flights)
        }catch(error){
            res.status(500).json({error: "Internal Server Error"})
        }
    }

}
