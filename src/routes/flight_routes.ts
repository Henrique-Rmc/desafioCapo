// Arquivo de rotas (flight_routes.ts)
import { Router } from "express";
import { FlightController } from "../controllers/flight_controller";
import { FlightService } from "../services/flight_service";
import { FlightRepository } from "../repositories/flight_repository";

const flightRouter = Router();

const flightRepository = new FlightRepository();
const flightService = new FlightService(flightRepository);
const flightController = new FlightController(flightService);
/**
 * Cria um voo
 */
flightRouter.post("/create", async (req, res) => {
  try {
    await flightController.createFlightHandler(req, res);
  } catch (error) {
    console.error("Erro ao acessar rota de criar voo:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

/**
 * resgata voos disponiveis para uma rota e data
 * GET /flights?origin={origin}&destination={destination}&date={date}
 */
flightRouter.get("/flights", async (req, res) => {
  try {
    await flightController.getFlightHandler(req, res);
  } catch (error) {
    console.error("Erro ao encontrar os vôos selecionados:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});


export { flightRouter };
