import { injectable } from "inversify";
import Service from "../base-classes/Service";
import RedeemedPromotionDAO from "../../dao/promotions/RedeemedPromotionsDAO";
import RedeemedPromotion from "../../model/RedeemedPromotion";

@injectable()
class RedeemedPromotionsService extends Service<RedeemedPromotion> {
  constructor(protected readonly _redeemedPromotionDAO: RedeemedPromotionDAO) {
    super(_redeemedPromotionDAO);
  }
}

export default RedeemedPromotionsService;
