import { Request, Response } from "express";
import { FlightController } from "../src/controllers/flight_controller";
import { FlightService } from "../src/services/flight_service";
import { flightSchema, findflightSchema } from "../src/schemas/flight_schema";

jest.mock("../src/services/flight_service");

describe("FlightController", () => {
    let flightController: FlightController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    const mockFlightRepository = {
        create: jest.fn(),
        find: jest.fn(),
    };

    const flightService = new FlightService(mockFlightRepository as any);

    beforeEach(() => {
        flightController = new FlightController(flightService);

        mockRequest = {
            body: {},
            query: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("createFlightHandler", () => {
        it("Deve criar um voo com sucesso", async () => {
            mockRequest.body = {
                flightNumber: "ABC123",
                origin: "São Paulo",
                destination: "Rio de Janeiro",
                departureTime: "2024-12-25T10:00:00",
                arrivalTime: "2024-12-20T11:30:00",
                capacity : 100
            };

            jest.spyOn(flightSchema, "parse").mockReturnValue(mockRequest.body);
            jest.spyOn(flightService, "createFlight").mockResolvedValue();

            await flightController.createFlightHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Voo criado com sucesso" });
        });

        it("Deve retornar erro 400 para dados inválidos", async () => {
            mockRequest.body = { invalidField: "invalidValue" };

            jest.spyOn(flightSchema, "parse").mockImplementation(() => {
                throw { name: "ZodError", errors: [{ path: ["flightNumber"], message: "Campo obrigatório" }] };
            });

            await flightController.createFlightHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "Dados inválidos.",
                details: [{ path: ["flightNumber"], message: "Campo obrigatório" }],
            });
        });
    });

    describe("FlightController - getFlightHandler", () => {
        it("Deve retornar uma lista de voos", async () => {
            // Mock da resposta do serviço
            const mockFlights = [
                {
                    id: 2,
                    flightNumber: "CD456",
                    origin: "Brasília",
                    destination: "Salvador",
                    departureTime: "2024-12-21T11:00:00.000Z",
                    arrivalTime: "2024-12-21T13:30:00.000Z",
                    capacity: 150,
                },
            ];
    
            // Mock do serviço
            (flightService.getFlights as jest.Mock).mockResolvedValue(mockFlights);
    
            // Mock do Request e Response
            const mockRequest = {
                query: {
                    origin: "Brasília",
                    destination: "Salvador",
                    date: "2024-12-21",
                },
            } as unknown as Request;
    
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;
    
            // Chama o controlador
            await flightController.getFlightHandler(mockRequest, mockResponse);
    
            // Verificações
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockFlights);
            expect(flightService.getFlights).toHaveBeenCalledWith({
                origin: "Brasília",
                destination: "Salvador",
                date: "2024-12-21",
            });
        });
    });
    
});