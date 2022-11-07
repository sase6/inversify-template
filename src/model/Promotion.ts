import { Model, QueryContext } from "objection";

class Promotion extends Model {
  static get tableName() {
    return "promotions";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["isFinished", "year", "month", "day"],

      properties: {
        id: { type: "string" },
        isFinished: { type: "boolean"},
        year: { type: "integer" },
        month: { type: "integer" },
        day: { type: "integer" },
      },
    };
  }
}

export default Promotion;