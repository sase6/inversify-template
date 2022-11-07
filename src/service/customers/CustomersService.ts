import { injectable } from "inversify";
import Service from "../base-classes/Service";
import { parse as uuidParse } from "uuid";
import CustomersDAO from "../../dao/customers/CustomersDAO";
import PromotionDAO from "../../dao/promotions/PromotionsDAO";
import RedeemedPromotionDAO from "../../dao/promotions/RedeemedPromotionsDAO";
import Customer from "../../model/Customer";

interface promotionDate {
  year: number;
  month: number;
  day: number;
};

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

  async hasPurchaseOlderThan(customerId: string, date: promotionDate) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - date.year);
    currentDate.setMonth(currentDate.getMonth() - date.month);
    // currentDate.setMonth(currentDate.getDay() - date.day); // How to set day?
    
    const purchases: any = await this.getRelatedPurchases(customerId);
    for (let i=0; i < purchases.length; i++) {
      const purchase: any = purchases[i];
      if (new Date(purchase.date) <= currentDate) return purchase;
    }
    return null;
  }

  async getPetGift(customerId: string, promotionId: string) {
    const promotion: any | undefined = await this._promotionsDAO.findById(promotionId);
    if (promotion === undefined || promotion.isFinished) return null;
    const date: promotionDate = {
      year: promotion.year || 0,
      month: promotion.month || 0,
      day: promotion.day || 0,
    }

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
        gift: `${randomPet.species} Gift for ${randomPet.name}`
      };
    }
    return null;
  }
}

export default CustomersService;
