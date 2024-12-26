"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findflightSchema = exports.flightSchema = void 0;
const zod_1 = require("zod");
exports.flightSchema = zod_1.z.object({
    flightNumber: zod_1.z.string().min(1, "O número do voo é obrigatório"),
    origin: zod_1.z.string().min(1, "A origem é obrigatória"),
    destination: zod_1.z.string().min(1, "O destino é obrigatório"),
    departureTime: zod_1.z.string().datetime({ local: true, message: "Data e hora de partida inválidas" }),
    arrivalTime: zod_1.z.string().datetime({ local: true, message: "Data e hora de chegada inválidas" }),
    capacity: zod_1.z.number().min(1, "A capacidade deve ser maior que zero"),
}).refine((data) => new Date(data.arrivalTime) > new Date(data.departureTime), {
    message: "O horário de chegada deve ser posterior ao horário de partida.",
    path: ["arrivalTime"],
});
exports.findflightSchema = zod_1.z
    .object({
    origin: zod_1.z.string().min(1, "A origem é obrigatória"),
    destination: zod_1.z.string().min(1, "O destino é obrigatório"),
    departureTime: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato YYYY-MM-DD"),
})
    .refine((data) => !isNaN(new Date(data.departureTime).getTime()), {
    message: "A data de partida não é válida.",
    path: ["departureTime"],
});
