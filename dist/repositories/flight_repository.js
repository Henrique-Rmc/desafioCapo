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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightRepository = void 0;
const config_1 = require("../config/config");
const flight_schema_1 = require("../schemas/flight_schema");
class FlightRepository {
    /**
     *
     * @param flight
     */
    saveFlight(flight) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
            * Insere um voo no banco de dados.
            * @param flight Dados do voo.
            */
            const query = `
        INSERT INTO flights (flightNumber, origin, destination, departureTime, arrivalTime, capacity)
        VALUES (?, ?, ?, ?, ?, ?);`;
            const params = [
                flight.flightNumber,
                flight.origin,
                flight.destination,
                flight.departureTime,
                flight.arrivalTime,
                flight.capacity,
            ];
            try {
                yield config_1.db.execute(query, params);
            }
            catch (error) {
                console.error("Erro ao salvar voo:", error);
                throw new Error("Erro ao salvar voo no banco de dados.");
            }
        });
    }
    findByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
            * Busca um Vôo no banco de dados pelo numero
            * @param number Dados do voo.
            */
            const query = `SELECT *
                    FROM flights
                    WHERE flightNumber = ?;`;
            try {
                const [rows] = yield config_1.db.query(query, [number]);
                if (rows.lenght === 0) {
                    return null;
                }
                const data = rows[0];
                const flight = flight_schema_1.flightSchema.parse(data);
                console.log("Vôo encontrado:", flight);
                return flight;
            }
            catch (error) {
                console.error("Erro Ao buscar um vôo com nesse parametro", error);
                throw new Error("Erro ao Buscar Vôo");
            }
        });
    }
    existsByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Busca um Vôo no banco de dados pelo número.
             * @param number Dados do voo.
             */
            const query = `SELECT *
                       FROM flights
                       WHERE flightNumber = ?;`;
            try {
                const [rows] = yield config_1.db.query(query, [number]);
                if (rows.length === 0) {
                    return false;
                }
                console.log("Vôo encontrado:", rows);
                return true;
            }
            catch (error) {
                console.error("Erro ao buscar voo com esse parâmetro:", error);
                throw new Error("Erro ao buscar voo");
            }
        });
    }
    /**
     *
     * @param origin
     * @param destination
     * @param date
     * @returns
     */
    static findByRouteAndDate(origin, destination, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT * FROM flights
            WHERE origin = ? AND destination = ? AND DATE(departureTime) = ? AND capacity > 0
        `;
            const [rows] = yield config_1.db.query(query, [origin, destination, date]);
            return rows;
        });
    }
    /**
     *
     * @param flightNumber
     * @param connection
     * @returns
     */
    reserveSeat(flightNumber, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkQuery = `SELECT * FROM flights WHERE flightNumber = ?;`;
            const updateQuery = `UPDATE flights SET capacity = capacity - 1 WHERE flightNumber = ? AND capacity > 0;`;
            try {
                const [rows] = yield connection.execute(checkQuery, [flightNumber]);
                if (rows.length === 0) {
                    console.log("Vôo não encontrado.");
                    return null;
                }
                const flight = rows[0];
                if (flight.capacity <= 0) {
                    console.log("Sem assentos disponíveis.");
                    return null;
                }
                const [result] = yield connection.execute(updateQuery, [flightNumber]);
                if (result.affectedRows === 0) {
                    console.log("Falha em reservar assento. O voo pode estar lotado.");
                    return null;
                }
                console.log("Assento reservado com sucesso.");
                return null;
            }
            catch (error) {
                console.error("Erro ao reservar assento:", error);
                throw error;
            }
        });
    }
}
exports.FlightRepository = FlightRepository;
