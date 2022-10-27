import Objection, { PartialModelGraph, PartialModelObject } from "objection";
import DAO from "../../dao/base-classes/DAO";

class Service<M extends Objection.Model> {
  constructor(protected readonly _DAO: DAO<M>) {}

  async getAll() {
    return this._DAO.getAll();
  }

  async getRelatedPurchases(id: string) {
    return this._DAO.getRelatedPurchases(id);
  }

  async checkPurchasesOlderThan(id: string, year: number = 0, month: number = 0, day: number = 0) {
    const date = new Date();
    date.setMonth(date.getFullYear() - year);
    date.setMonth(date.getMonth() - month);
    date.setMonth(date.getDay() - day);
    
    const purchases: any = await this.getRelatedPurchases(id);
    for (let i=0; i < purchases.length; i++) {
      const purchase: any = purchases[i];
      if (new Date(purchase.date) <= date) return purchase;
    }
  }

  async insert(obj: PartialModelObject<M> | PartialModelObject<M>[]) {
    return this._DAO.insert(obj);
  }

  async insertGraph(obj: PartialModelGraph<M>) {
    return this._DAO.insertGraph(obj);
  }

  async findById(id: string) {
    return this._DAO.findById(id);
  }

  async truncate() {
    return this._DAO.truncate();
  }

  async deleteById(id: string) {
    return this._DAO.deleteById(id);
  }

  async patchAndFetchById(id: string, options: any) {
    return this._DAO.patchAndFetchById(id, options);
  }
}

export default Service;
