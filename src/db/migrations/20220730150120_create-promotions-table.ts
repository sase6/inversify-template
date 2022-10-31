import { Knex } from "knex";

export const up = async (knex: Knex) => {
  await knex.schema.createTable("promotions", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
    table.timestamps(true, true);
    table.boolean("isFinished").defaultTo(false);
    table.integer("year").defaultTo(0);
    table.integer("month").defaultTo(0);
    table.integer("day").defaultTo(0);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTable("promotions");
};