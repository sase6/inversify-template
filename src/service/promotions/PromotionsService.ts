import { injectable } from "inversify";
import Service from "../base-classes/Service";
import PromotionDAO from "../../dao/promotions/PromotionsDAO";
import Promotion from "../../model/Promotion";

@injectable()
class PromotionsService extends Service<Promotion> {
  constructor(protected readonly _promotionDAO: PromotionDAO) {
    super(_promotionDAO);
  }
}

export default PromotionsService;
