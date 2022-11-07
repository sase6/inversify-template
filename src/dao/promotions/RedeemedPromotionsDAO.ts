import { inject, injectable } from "inversify";
import RedeemedPromotion from "../../model/RedeemedPromotion";
import DAO from "../base-classes/DAO";

@injectable()
class RedeemedPromotionDAO extends DAO<RedeemedPromotion> {
  constructor(
    @inject("RedeemedPromotion")
    protected readonly _redeemedPromotion: typeof RedeemedPromotion
  ) {
    super(_redeemedPromotion);
  }
}

export default RedeemedPromotionDAO;