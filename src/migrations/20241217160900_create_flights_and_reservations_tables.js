/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('Flights', (table) => {
        table.increments('id').primary();
        table.string('flightNumber', 10).unique().notNullable();
        table.string('origin', 50).notNullable();
        table.string('destination', 50).notNullable();
        table.dateTime('departureTime').notNullable();
        table.dateTime('arrivalTime').notNullable();
        table.integer('capacity').notNullable();
      })
      .createTable('Reservations', (table) => {
        table.increments('id').primary();
        table.string('clientName', 100).notNullable();
        table.string('flightNumber', 10).references('flightNumber').inTable('Flights').onDelete('CASCADE');
        table.dateTime('reservationDate').notNullable();
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('Reservations')
      .dropTableIfExists('Flights');
  };