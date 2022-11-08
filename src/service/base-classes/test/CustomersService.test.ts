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
    promotionsDao = sandbox.createStubInstance(PromotionDAO);
    redeemedPromotionsDao = sandbox.createStubInstance(RedeemedPromotionDAO);
    customersDao.getRelatedPurchases = sandbox.stub();
    promotionsDao.findById = sandbox.stub();
    redeemedPromotionsDao.insert = sandbox.stub();


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

  describe("# getRelatedPets", () => {
    it("calls DAO with expected method and args", async () => {
      // arrange
      const customerId = "123";
      customersDao.getRelatedPets.withArgs("123").resolves([]);
      // act
      const result = await service.getRelatedPets(customerId);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedPets);
      sandbox.assert.calledWith(customersDao.getRelatedPets, customerId);
      expect(result).to.deep.equal([]);
    });
  });

  describe("# getRelatedRedeemedPromotions", () => {
    it("calls DAO with expected method and args", async () => {
      // arrange
      const customerId = "123";
      const promotionId = "6MonthPurchase";
      customersDao.getRelatedRedeemedPromotions.withArgs("123", "6MonthPurchase").resolves([]);
      // act
      const result = await service.getRelatedRedeemedPromotions(customerId, promotionId);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedRedeemedPromotions);
      sandbox.assert.calledWith(customersDao.getRelatedRedeemedPromotions, customerId, promotionId);
      expect(result).to.deep.equal([]);
    });
  });

  describe("# hasPurchaseOlderThan", () => {
    it("should return null when no purchase match requirements", async () => {
      // arrange
      const customerId = "123";
      const date = {year: 0, month: 6, day: 0};
      customersDao.getRelatedPurchases.withArgs("123").resolves([]);
      // act
      const result = await service.hasPurchaseOlderThan(customerId, date);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedPurchases);
      expect(result).to.deep.equal(null);
    });

    it("should return a purchase a customer made more than 6 months ago", async () => {
      // arrange
      const customerId = "123";
      const exampleDate = new Date();
      const dummyDateObj = {year: 0, month: 6, day: 0};
      exampleDate.setMonth(-7);
      const purchaseDate: any = {
        date: exampleDate
      };
      customersDao.getRelatedPurchases.withArgs("123").resolves([purchaseDate]);
      // act
      const result = await service.hasPurchaseOlderThan(customerId, dummyDateObj);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedPurchases);
      expect(result).to.deep.equal({date: exampleDate});
    });
  });

  describe("# getPetGift", () => {
    it("should return null when a promotion doesn't exist", async () => {
      // arrange
      const customerId = "123";
      const fakePromotionId = "2MonthPurchase";
      promotionsDao.findById.withArgs("2MonthPurchase").resolves(undefined);
      // act
      const result = await service.getPetGift(customerId, fakePromotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a promotion is finished", async () => {
      // arrange
      const customerId = "123";
      const fakePromotionId = "2MonthPurchase";
      const promotionObj: any = {
        isFinished: true
      };
      promotionsDao.findById.withArgs("2MonthPurchase").resolves(promotionObj);
      // act
      const result = await service.getPetGift(customerId, fakePromotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a promotion has been redeemed", async () => {
      // arrange
      const customerId = "123";
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
      };
      const redeemedPromotion: any = {
        customerId, promotionId
      };
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs("123", "6MonthPurchase").resolves([redeemedPromotion]);
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a customer does not meet promotion requirements", async () => {
      // arrange
      const customerId = "123";
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
        month: 6
      };
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs("123", "6MonthPurchase").resolves([]);
      customersDao.getRelatedPurchases.withArgs("123").resolves([]);
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a customer does not have a pet", async () => {
      // arrange
      const customerId = "123";
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
        month: 6
      };
      const relatedPurchase: any = {
        date: (new Date().setMonth(-7))
      };
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs("123", "6MonthPurchase").resolves([]);
      customersDao.getRelatedPurchases.withArgs("123").resolves([relatedPurchase]);
      customersDao.getRelatedPets.withArgs("123").resolves([]);
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return a gift for a eligible customer", async () => {
      // arrange
      const customerId = "123";
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
        month: 6
      };
      const relatedPurchase: any = {
        date: (new Date().setMonth(-7))
      };
      const relatedPet: any = {
        species: "dog",
        name: "berny"
      };
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs("123", "6MonthPurchase").resolves([]);
      customersDao.getRelatedPurchases.withArgs("123").resolves([relatedPurchase]);
      customersDao.getRelatedPets.withArgs("123").resolves([relatedPet]);
      redeemedPromotionsDao.insert.withArgs({customerId, promotionId}).resolves();
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal({ gift: 'dog Gift for berny' });
    });
  });

});
