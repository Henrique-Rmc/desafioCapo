"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationSchema = void 0;
const zod_1 = require("zod");
exports.reservationSchema = zod_1.z.object({
    clientName: zod_1.z.string().min(1, "O nome do cliente é obrigatório"),
    flightNumber: zod_1.z.string().min(1, "O número do voo é obrigatório"),
    reservationDate: zod_1.z.string().date("Data da reserva inválida"),
});
