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
  getRelatedPurchases: SinonStub<any, Methods>;
  getRelatedPets: SinonStub<any, Methods>;
  getRelatedRedeemedPromotions: SinonStub<any, Methods>;
}

describe("src :: dao :: customers :: CustomersDAO", () => {
  let methods: Methods;
  let dao: DAO;

  beforeEach(() => {
    methods = {
      getRelatedPurchases: sandbox.stub(),
      getRelatedPets: sandbox.stub(),
      getRelatedRedeemedPromotions: sandbox.stub(),
    };

    dao = new DAO(methods as any);
  });

  afterEach(() => {
    sandbox.reset();
  });

  describe.skip("# getRelatedPurchases", () => {
    it("should call the getRelatedPurchases function", async () => {
      // arrange
      const customerId = "123";
      methods.getRelatedPurchases.resolves([]);
      // act
      const result = await dao.getRelatedPurchases(customerId);
      // assert
      console.log(result);
    //   sandbox.assert.calledOnce(methods.query);
    //   expect(result).to.deep.equal([]);
    });
  });
});
