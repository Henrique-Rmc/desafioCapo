/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("flights").insert([
    {
      flightNumber: "AB123",
      origin: "São Paulo",
      destination: "Rio de Janeiro",
      departureTime: "2024-12-20 10:00:00",
      arrivalTime: "2024-12-20 11:30:00",
      capacity: 100,
  },
  {
      flightNumber: "CD456",
      origin: "Brasília",
      destination: "Salvador",
      departureTime: "2024-12-21 08:00:00",
      arrivalTime: "2024-12-21 10:30:00",
      capacity: 150,
  },
]);
}