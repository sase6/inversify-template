import { Knex } from "knex";

export const up = async (knex: Knex) => {
  await knex.schema.createTable("redeemed_promotions", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
    table.timestamps(true, true);
    table.uuid("customerId");
    table.string("promotionsId");
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTable("redeemed_promotions");
};