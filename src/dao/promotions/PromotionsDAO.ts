import { inject, injectable } from "inversify";
import Promotion from "../../model/Promotion";
import DAO from "../base-classes/DAO";

@injectable()
class PromotionDAO extends DAO<Promotion> {
  constructor(
    @inject("Promotion")
    protected readonly _promotion: typeof Promotion
  ) {
    super(_promotion);
  }
}

export default PromotionDAO;