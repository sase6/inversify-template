import { Model, QueryContext } from "objection";
import Customer from "./Customer";

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
        customerId: { type: "string"},
        promotionId: { type: "string" },
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      owners: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "redeemed_promotions.customerId",
          to: "customers.id",
        },
      },
    };
  }
}

export default RedeemedPromotion;