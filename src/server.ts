import express from 'express';
import bodyParser from 'body-parser';
import { flightRouter } from './routes/flight_routes';
import { checkDbConnection } from './config/config';
import dotenv from 'dotenv';
import { reservationRouter } from './routes/reservation_routes';

dotenv.config(); 
const app = express();
app.use(bodyParser.json());
app.use('/flight', flightRouter);
app.use('/reservation', reservationRouter);

// Obtém a porta da variável de ambiente ou usa a 3000 como padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        // Verifica a conexão com o banco de dados quando o servidor iniciar
        await checkDbConnection();
        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);  // Encerra o servidor em caso de erro na conexão
    }
});
