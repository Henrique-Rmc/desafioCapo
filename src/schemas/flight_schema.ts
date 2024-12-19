import { z } from "zod";

export const flightSchema = z.object({
  flightNumber: z.string().min(1, "O número do voo é obrigatório"),
  origin: z.string().min(1, "A origem é obrigatória"),
  destination: z.string().min(1, "O destino é obrigatório"),
  departureTime: z.string().datetime({local:true , message: "Data e hora de partida inválidas" }),
  arrivalTime: z.string().datetime({local:true , message: "Data e hora de chegada inválidas" }),
  capacity: z.number().min(1, "A capacidade deve ser maior que zero"),
}).refine(
    (data) => new Date(data.arrivalTime) > new Date(data.departureTime),
    {
        message: "O horário de chegada deve ser posterior ao horário de partida.",
        path: ["arrivalTime"],
    }
)

export const findflightSchema = z
  .object({
    origin: z.string().min(1, "A origem é obrigatória"),
    destination: z.string().min(1, "O destino é obrigatório"),
    departureTime: z.string().regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "A data deve estar no formato YYYY-MM-DD"
    ),
  })
  .refine(
    (data) => !isNaN(new Date(data.departureTime).getTime()),
    {
      message: "A data de partida não é válida.",
      path: ["departureTime"],
    }
  );