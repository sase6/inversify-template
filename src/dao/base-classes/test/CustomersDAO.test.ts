import chai from "chai";
import sinon, { SinonStub } from "sinon";
import DAO from "../../customers/CustomersDAO";
import { Model, PartialModelObject } from "objection";
import { v4 as uuidv4 } from "uuid";

const { expect } = chai;
const sandbox = sinon.createSandbox();

// creating an interface is not ideal, but it's necessary due to 
// limitations with stubbing the Objection.Model instance passed to the DAO
// for a better test implementation, see Service.test.ts
interface Methods {
  relatedQuery: SinonStub<any, Methods>;
  for: SinonStub<any, Methods>;
  where: SinonStub<any, Methods>;
  orderBy: SinonStub<any, Methods>;
}

describe("src :: dao :: customers :: CustomersDAO", () => {
  let methods: Methods;
  let dao: DAO;

  beforeEach(() => {
    methods = {
      relatedQuery: sandbox.stub(),
      for: sandbox.stub(),
      where: sandbox.stub(),
      orderBy: sandbox.stub(),
    };

    dao = new DAO(methods as any);
  });

  afterEach(() => {
    sandbox.reset();
  });

  describe("# getRelatedPurchases", () => {
    it("should return purchases related to the customer", async () => {
      // arrange
      const customerId = "123";
      methods.relatedQuery.returnsThis();
      methods.for.returnsThis();
      methods.where.withArgs("customerId", "123").returnsThis();
      methods.orderBy.resolves([]);
      // act
      const result = await dao.getRelatedPurchases(customerId);
      // assert
      expect(result).to.deep.equal([]);
    });
  });

  describe("# getRelatedPets", () => {
    it("should return purchases related to the customer", async () => {
      // arrange
      const customerId = "123";
      methods.relatedQuery.returnsThis();
      methods.for.returnsThis();
      methods.where.resolves([]);
      // act
      const result = await dao.getRelatedPets(customerId);
      // assert
      expect(result).to.deep.equal([]);
    });
  });

  describe("# getRelatedRedeemedPromotions", () => {
    it("should return redeemedPromotions related to the customer", async () => {
      // arrange
      const customerId = "123";
      const promotionId = "6MonthPurchase";
      methods.relatedQuery.returnsThis();
      methods.for.returnsThis();
      methods.where.resolves([]);
      // act
      const result = await dao.getRelatedRedeemedPromotions(customerId, promotionId);
      // assert
      expect(result).to.deep.equal([]);
    });
  });
});
