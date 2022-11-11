import { Knex } from "knex";

export const up = async (knex: Knex) => {
  await knex.schema.createTable("promotions", (table) => {
    table.string("id");
    table.timestamps(true, true);
    table.boolean("isFinished").defaultTo(false);
    table.date("date");
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTable("promotions");
};