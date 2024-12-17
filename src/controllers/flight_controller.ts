import { flightSchema } from "../schemas/flight_schema";
import { Request, Response } from "express";
import { FlightService } from "../services/flight_service";

export class FlightController {
    constructor(private flightService: FlightService) {}

    async createFlightHandler(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;

            const validatedData = data;

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
}
