import { findflightSchema, flightSchema } from "../schemas/flight_schema";
import { Request, Response } from "express";
import { FlightService } from "../services/flight_service";
import { Flight } from "../models/Flight";

export class FlightController {
    constructor(public flightService: FlightService) {}

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
        try {
            const { origin, destination, date } = req.query as {
                origin?: string;
                destination?: string;
                date?: string;
            };
    
            if (!origin || !destination || !date) {
                throw new Error("Parâmetros ausentes ou inválidos.");
            }
    
            // Validação dos parâmetros
            const flightParams = findflightSchema.parse({
                origin: decodeURIComponent(origin),
                destination: decodeURIComponent(destination),
                departureTime: date,
            });
    
            // Chamada ao serviço com um objeto
            const flights = await this.flightService.getFlights({
                origin: flightParams.origin,
                destination: flightParams.destination,
                date: flightParams.departureTime,
            });
    
            res.status(200).json(flights);
        } catch (error) {
            console.error("Error in getFlightHandler:", error);
    
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }

}
