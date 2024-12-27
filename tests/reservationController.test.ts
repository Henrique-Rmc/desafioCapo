import { Request, Response } from "express";
import { ReservationController } from "../src/controllers/reservation_controller";
import { ReservationService } from "../src/services/reservation_service";

jest.mock("../src/services/reservation_service");

describe("ReservationController", () => {
    let reservationController: ReservationController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    const mockReservationService = {
        findReservationsByUserName: jest.fn(),
    };

    beforeEach(() => {
        reservationController = new ReservationController(mockReservationService as any);

        mockRequest = {
            query: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("findReservationsByUserNameHandler", () => {
        it("Deve retornar todas as reservas de um usuário pelo nome", async () => {
            mockRequest.query = { name: "João" };

            const mockResults = [
                {
                    reservationId: 1,
                    userId: 3,
                    userName: "João da Silva",
                    flightId: 2,
                    flightNumber: "CD456",
                    origin: "Brasília",
                    destination: "Salvador",
                    departureTime: "2024-12-21T11:00:00.000Z",
                    arrivalTime: "2024-12-21T13:30:00.000Z",
                    capacity: 150,
                },
            ];

            jest.spyOn(mockReservationService, "findReservationsByUserName").mockResolvedValue(mockResults);

            await reservationController.findReservationsByUserNameHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockReservationService.findReservationsByUserName).toHaveBeenCalledWith("João");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockResults);
        });

        it("Deve retornar uma lista vazia se não houver reservas para o usuário", async () => {
            mockRequest.query = { name: "UsuárioInexistente" };

            jest.spyOn(mockReservationService, "findReservationsByUserName").mockResolvedValue([]);

            await reservationController.findReservationsByUserNameHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockReservationService.findReservationsByUserName).toHaveBeenCalledWith("UsuárioInexistente");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });

        it("Deve retornar erro 400 se o nome do usuário não for fornecido", async () => {
            mockRequest.query = {};

            await reservationController.findReservationsByUserNameHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Nome do usuário é obrigatório." });
        });
    });
});
