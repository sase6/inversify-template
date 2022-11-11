// we should not need to import "reflect-metadata" here, 
// but there is a bug which requires it.
import "reflect-metadata";
import { inject, injectable } from "inversify";
import Customer from "../../model/Customer";
import DAO from "../base-classes/DAO";

@injectable()
class CustomersDAO extends DAO<Customer> {
  constructor(
    @inject("Customer")
    protected readonly _customer: typeof Customer
  ) {
    super(_customer);
  }

  async getRelatedPurchases(id: string) {
    return this.model
      .relatedQuery("purchases")
      .for(id)
      .where("customerId", id)
      .orderBy("date");
  }

  async getRelatedPets(id: string) {
    return this.model
    .relatedQuery("pets")
    .for(id)
    .where("ownerId", id);
  }

  async getRelatedRedeemedPromotions(customerId: string, promotionId: string) {
    return this._customer
      .relatedQuery("redeemed_promotions")
      .for(customerId)
      .where("promotionId", promotionId)
  }
}

export default CustomersDAO;
