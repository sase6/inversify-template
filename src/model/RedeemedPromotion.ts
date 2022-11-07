import { Model, QueryContext } from "objection";

class RedeemedPromotion extends Model {
  static get tableName() {
    return "redeemed_promotions";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["customerId", "promotionId"],

      properties: {
        id: { type: "string" },
        customerId: { type: "uuid"},
        promotionId: { type: "string" },
      },
    };
  }
}

export default RedeemedPromotion;