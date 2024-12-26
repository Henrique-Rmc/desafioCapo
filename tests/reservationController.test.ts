import { Request, Response } from "express";
import { ReservationController } from "../src/controllers/reservation_controller";
import { ReservationService } from "../src/services/reservation_service";
import { reservationSchema } from "../src/schemas/reservation_schema";
import fs from "fs";
import path from "path";

jest.mock("fs");
jest.mock("pdfkit", () => {
    return jest.fn().mockImplementation(() => ({
        pipe: jest.fn(),
        fontSize: jest.fn().mockReturnThis(),
        text: jest.fn().mockReturnThis(),
        moveDown: jest.fn().mockReturnThis(),
        end: jest.fn(),
    }));
});


describe("ReservationController", () => {
    let reservationController: ReservationController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    const mockReservationRepository = {
        create: jest.fn(),
        find: jest.fn(),
    };

    const mockFlightRepository = {
        find: jest.fn(),
    };

    beforeEach(() => {
        const mockReservationService = {
            createReservation: jest.fn(),
        };
        reservationController = new ReservationController(mockReservationService as any);

        mockRequest = {
            body: {},
            protocol: "http",
            get: jest.fn().mockReturnValue("localhost:3000"),
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("createReservationHandler", () => {
        it("Deve criar uma reserva com sucesso", async () => {
            mockRequest.body = {
                clientName: "John Doe",
                flightNumber: "ABC123",
                reservationDate: "2024-12-25",
            };

            jest.spyOn(reservationSchema, "parse").mockReturnValue(mockRequest.body);
            jest.spyOn(reservationController.reservationService, "createReservation").mockResolvedValue();
            jest.spyOn(reservationController as any, "generateReservationPDF").mockResolvedValue(
                "/mock/path/to/pdf"
            );

            await reservationController.createReservationHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Reserva criado com sucesso" });
        });

        it("Deve retornar erro 400 para dados inválidos", async () => {
            mockRequest.body = { invalidField: "invalidValue" };

            jest.spyOn(reservationSchema, "parse").mockImplementation(() => {
                throw { name: "ZodError", errors: [{ path: ["clientName"], message: "Campo obrigatório" }] };
            });

            await reservationController.createReservationHandler(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "Dados inválidos.",
                details: [{ path: ["clientName"], message: "Campo obrigatório" }],
            });
        });
    });
});
