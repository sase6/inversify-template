// getRelatedRedeemedPromotions
// hasPurchaseOlderThan
// getPetGift

import chai from "chai";
import sinon, { SinonStubbedInstance } from "sinon";
import CustomersDAO from "../../../dao/customers/CustomersDAO";
import PromotionDAO from "../../../dao/promotions/PromotionsDAO";
import RedeemedPromotionDAO from "../../../dao/promotions/RedeemedPromotionsDAO";
import { Model } from "objection";
import { v4 as uuidv4 } from 'uuid';

// file under test
import Service from "../../customers/CustomersService";
import PromotionsService from "../../promotions/PromotionsService";
import RedeemedPromotionsService from "../../promotions/RedeemedPromotionsService";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("src :: service :: customers :: CustomersService", () => {
  let customersDao: SinonStubbedInstance<CustomersDAO>;
  let promotionsDao: SinonStubbedInstance<PromotionDAO>;
  let redeemedPromotionsDao: SinonStubbedInstance<RedeemedPromotionDAO>;

  let service: Service;
  beforeEach(() => {
    customersDao = sandbox.createStubInstance(CustomersDAO);
    customersDao.getRelatedPurchases = sandbox.stub();


    service = new Service(customersDao, promotionsDao, redeemedPromotionsDao);
  });

  afterEach(() => {
    sandbox.restore();
    sandbox.reset();
  });

  describe("# getRelatedPurchases", () => {
    it("calls DAO with expected method and args", async () => {
      // arrange
      const customerId = "123";
      customersDao.getRelatedPurchases.withArgs("123").resolves([]);
      // act
      const result = await service.getRelatedPurchases(customerId);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedPurchases);
      sandbox.assert.calledWith(customersDao.getRelatedPurchases, customerId);
      expect(result).to.deep.equal([]);
    });
  });
});
