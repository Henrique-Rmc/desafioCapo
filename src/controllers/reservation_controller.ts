import { reservationSchema } from "../schemas/reservation_schema";
import { FlightService } from "../services/flight_service";
import { Request, Response } from "express";
import { ReservationService } from "../services/reservation_service";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


export class ReservationController{

    constructor(private reservationService: ReservationService){}

    async createReservationHandler(req: Request, res: Response): Promise<void>{
        try{
            const data = req.body
            const validatedData = reservationSchema.parse(data)
            console.log(validatedData)
            await this.reservationService.createReservation(validatedData)

            const pdfFilePath = await this.generateReservationPDF(validatedData);
            const downloadLink = `${req.protocol}://${req.get("host")}/downloads/${path.basename(pdfFilePath)}`;

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


    private async generateReservationPDF(data: any): Promise<string> {
        const { clientName, flightNumber, reservationDate } = data;

        const pdfFilePath = path.join(__dirname, "../downloads", `${flightNumber}-${Date.now()}.pdf`);

        if (!fs.existsSync(path.dirname(pdfFilePath))) {
            fs.mkdirSync(path.dirname(pdfFilePath), { recursive: true });
        }

        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfFilePath);

        doc.pipe(writeStream);
        doc.fontSize(20).text("Detalhes da Reserva", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Nome do Cliente: ${clientName}`);
        doc.text(`Número do Voo: ${flightNumber}`);
        doc.text(`Data da Reserva: ${reservationDate}`);
        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on("finish", () => resolve(pdfFilePath));
            writeStream.on("error", (error) => reject(error));
        });
    }

    async getReservationsBy(req: Request, res: Response): Promise<void>{
        try{
            const {name} = req.query as {name?: string}
            if(!name){
                res.status(400).json({error:"O nome do usuario é necessario"})
                return;
            }

            const reservations = await this.reservationService.getReservationByName(name)

            res.status(201).json(reservations);
        }catch (error: any) {
            console.error("Error in getReservationsByUserName:", error);
            res.status(500).json({ error: "Erro ao buscar reservas." });
        }
    }
   
}
