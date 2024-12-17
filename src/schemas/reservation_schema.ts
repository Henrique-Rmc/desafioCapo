import { z } from "zod";

export const reservationSchema = z.object({
  clientName: z.string().min(1, "O nome do cliente é obrigatório"),
  flightNumber: z.string().min(1, "O número do voo é obrigatório"),
  reservationDate: z.string().datetime({ message: "Data da reserva inválida" }),
});
