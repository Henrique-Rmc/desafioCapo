// Arquivo de rotas (flight_routes.ts)
import { Router } from "express";
import { FlightController } from "../controllers/flight_controller";
import { FlightService } from "../services/flight_service";
import { FlightRepository } from "../repositories/flight_repository";

const flightRouter = Router();

const flightRepository = new FlightRepository();
const flightService = new FlightService(flightRepository);
const flightController = new FlightController(flightService);

flightRouter.post("/create", async (req, res) => {
  try {
    await flightController.createFlightHandler(req, res);
  } catch (error) {
    console.error("Erro ao criar voo:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export { flightRouter };
