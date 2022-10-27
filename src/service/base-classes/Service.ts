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
