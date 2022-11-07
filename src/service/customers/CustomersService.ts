import { injectable } from "inversify";
import Service from "../base-classes/Service";
import CustomersDAO from "../../dao/customers/CustomersDAO";
import PromotionDAO from "../../dao/promotions/PromotionsDAO";
import Customer from "../../model/Customer";

interface promotionDate {
  year: number;
  month: number;
  day: number;
};

@injectable()
class CustomersService extends Service<Customer> {
  constructor(protected readonly _customersDAO: CustomersDAO, protected readonly _promotionsDAO: PromotionDAO) {
    super(_customersDAO);
    this._promotionsDAO = _promotionsDAO;
  }

  async getRelatedPurchases(id: string) {
    return this._customersDAO.getRelatedPurchases(id);
  }

  async getRelatedPets(id: string) {
    return this._customersDAO.getRelatedPets(id);
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
    const promotion: any = await this._promotionsDAO.findById(promotionId);
    if (promotion === undefined || promotion.isFinished) return null;
    const date: promotionDate = {
      year: promotion.year || 0,
      month: promotion.month || 0,
      day: promotion.day || 0,
    }
    
    // // Check if promotion has already been redeemed
    //   // if it has, return null

    const purchase = await this.hasPurchaseOlderThan(customerId, date);
    if (purchase === null) return null;

    const pets = await this.getRelatedPets(customerId);
    const randomIndex = Math.round(Math.random() * (pets.length - 1));
    const randomPet = pets[randomIndex];
    if (randomPet) {
      // insert a new redeemed_promotion with promotion id and customer id

      return {
        gift: "gift for petType"
      };
    }
    return null;
  }
}

export default CustomersService;
