"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const reservation_schema_1 = require("../schemas/reservation_schema");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ReservationController {
    constructor(reservationService) {
        this.reservationService = reservationService;
    }
    createReservationHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const validatedData = reservation_schema_1.reservationSchema.parse(data);
                console.log(validatedData);
                yield this.reservationService.createReservation(validatedData);
                const pdfFilePath = yield this.generateReservationPDF(validatedData);
                const downloadLink = `${req.protocol}://${req.get("host")}/downloads/${path_1.default.basename(pdfFilePath)}`;
                res.status(201).json({ message: "Reserva criado com sucesso" });
            }
            catch (error) {
                if (error.name === "ZodError") {
                    res.status(400).json({
                        error: "Dados inválidos.",
                        details: error.errors.map((e) => ({
                            path: e.path,
                            message: e.message
                        }))
                    });
                }
                else {
                    res.status(500).json({
                        error: error.message || "Erro interno do servidor."
                    });
                }
            }
        });
    }
    generateReservationPDF(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientName, flightNumber, reservationDate } = data;
            const pdfFilePath = path_1.default.join(__dirname, "../downloads", `${flightNumber}-${Date.now()}.pdf`);
            if (!fs_1.default.existsSync(path_1.default.dirname(pdfFilePath))) {
                fs_1.default.mkdirSync(path_1.default.dirname(pdfFilePath), { recursive: true });
            }
            const doc = new pdfkit_1.default();
            const writeStream = fs_1.default.createWriteStream(pdfFilePath);
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
        });
    }
}
exports.ReservationController = ReservationController;
