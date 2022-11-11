import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import Service from "../service/customers/CustomersService";
import ApiError from "../middleware/ApiError";

@injectable()
class CustomersController {
  constructor(private readonly _service: Service) {
    this.getAll = this.getAll.bind(this);
    this.getPetGift = this.getPetGift.bind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._service.getAll();
      return res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }

  async getPetGift(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId, promotionId } = req.params; 
      const result = await this._service.getPetGift(customerId, promotionId);
      return res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }
}

export default CustomersController;
