import Objection, { PartialModelObject, QueryBuilder } from "objection";

class DAO<T extends Objection.Model> {
  constructor(protected readonly model: typeof Objection.Model) {
    this.model = model;
  }

  async getAll() {
    return this.model.query() as QueryBuilder<T>;
  }

  async getRelatedPurchases(id: string) {
    return this.model
      .relatedQuery("purchases")
      .for(id)
      .where("customerId", id)
      .orderBy("date");
  }

  async getRelatedPets(id: string) {
    return this.model
    .relatedQuery("pets")
    .for(id)
    .where("ownerId", id);
  }

  // NOTE: The return value of the insert query only contains the properties given to the insert method plus the identifier. 
  // This is because we don't make an additional fetch query after the insert. Using postgres you can chain returning('*') to the query to get all properties
  // NOTE: As of 2022, only Postgres supports passing an array of objects to insert
  async insert(options: PartialModelObject<T> | PartialModelObject<T>[]) {
    return this.model
      .query()
      .insert(options)
      .returning("*") as unknown as QueryBuilder<T, T[]>;
  }

  async insertGraph(
    graph: Objection.PartialModelGraph<T, T & Objection.GraphParameters>
  ) {
    return this.model.query().insertGraph(graph);
  }

  async findById(id: string) {
    return this.model.query().findById(id);
  }

  async truncate() {
    return this.model.query().truncate();
  }

  async deleteById(id: string) {
    return this.model.query().deleteById(id).returning("*");
  }

  async patchAndFetchById(id: string, patch: Objection.PartialModelObject<T>) {
    return this.model.query().patchAndFetchById(id, patch);
  }
}

export default DAO;
