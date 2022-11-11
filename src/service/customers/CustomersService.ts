import { injectable } from "inversify";
import Service from "../base-classes/Service";
import { parse as uuidParse } from "uuid";
import CustomersDAO from "../../dao/customers/CustomersDAO";
import PromotionDAO from "../../dao/promotions/PromotionsDAO";
import RedeemedPromotionDAO from "../../dao/promotions/RedeemedPromotionsDAO";
import Customer from "../../model/Customer";

@injectable()
class CustomersService extends Service<Customer> {
  constructor(protected readonly _customersDAO: CustomersDAO, protected readonly _promotionsDAO: PromotionDAO, protected readonly _redeemedPromotionsDAO: RedeemedPromotionDAO) {
    super(_customersDAO);
    this._promotionsDAO = _promotionsDAO;
    this._redeemedPromotionsDAO = _redeemedPromotionsDAO;
  }

  async getRelatedPurchases(id: string) {
    return this._customersDAO.getRelatedPurchases(id);
  }

  async getRelatedPets(id: string) {
    return this._customersDAO.getRelatedPets(id);
  }

  async getRelatedRedeemedPromotions(customerId: string, promotionId: string) {
    return this._customersDAO.getRelatedRedeemedPromotions(customerId, promotionId);
  }

  async hasPurchaseOlderThan(customerId: string, date: Date) {
    const purchases: any = await this.getRelatedPurchases(customerId);
    for (let i=0; i < purchases.length; i++) {
      const purchase: any = purchases[i];
      if (new Date(purchase.date) <= date) return purchase;
    }
    return null;
  }

  async getPetGift(customerId: string, promotionId: string) {
    const isValidUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    if (!isValidUUID.test(customerId)) return null;
    const customer = await this.findById(customerId);
    if (customer === undefined) return null;

    const promotion: any | undefined = await this._promotionsDAO.findById(promotionId);
    if (promotion === undefined || promotion.isFinished) return null;
    const date = promotion.date;

    const redeemedPromotions: any = await this.getRelatedRedeemedPromotions(customerId, promotionId);
    if (redeemedPromotions.length !== 0) return null;

    const purchase = await this.hasPurchaseOlderThan(customerId, date);
    if (purchase === null) return null;

    const pets = await this.getRelatedPets(customerId);
    const randomIndex = Math.round(Math.random() * (pets.length - 1));
    const randomPet: any = pets[randomIndex];
    if (randomPet) {
      this._redeemedPromotionsDAO.insert({
        customerId,
        promotionId
      });

      return {
        gift: `${randomPet.species} Gift for ${randomPet.name}`,
        message: `Thank you for your purchase on ${purchase.date}!`,
      };
    }
    return null;
  }
}

export default CustomersService;
