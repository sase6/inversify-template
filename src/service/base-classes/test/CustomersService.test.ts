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
    customersDao.findById = sandbox.stub();


    service = new Service(customersDao, promotionsDao, redeemedPromotionsDao);
  });

  afterEach(() => {
    sandbox.restore();
    sandbox.reset();
  });

  describe("# getRelatedPurchases", () => {
    it("calls DAO with expected method and args", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      customersDao.getRelatedPurchases.withArgs(customerId).resolves([]);
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
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      customersDao.getRelatedPets.withArgs(customerId).resolves([]);
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
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const promotionId = "6MonthPurchase";
      customersDao.findById.withArgs(customerId).resolves(customer);
      customersDao.getRelatedRedeemedPromotions.withArgs(customerId, "6MonthPurchase").resolves([]);
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
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      customersDao.findById.withArgs(customerId).resolves(customer);
      customersDao.getRelatedPurchases.withArgs(customerId).resolves([]);
      // act
      const result = await service.hasPurchaseOlderThan(customerId, date);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedPurchases);
      expect(result).to.deep.equal(null);
    });

    it("should return a purchase a customer made more than 6 months ago", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const exampleDate = new Date();
      const promotionDate = new Date();
      promotionDate.setMonth(promotionDate.getMonth() - 6);
      exampleDate.setMonth(-7);
      const purchaseDate: any = {
        date: exampleDate
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      customersDao.getRelatedPurchases.withArgs(customerId).resolves([purchaseDate]);
      // act
      const result = await service.hasPurchaseOlderThan(customerId, promotionDate);
      // assert
      sandbox.assert.calledOnce(customersDao.getRelatedPurchases);
      expect(result).to.deep.equal({date: exampleDate});
    });
  });

  describe("# getPetGift", () => {
    it("should return null when a promotion doesn't exist", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const fakePromotionId = "2MonthPurchase";
      customersDao.findById.withArgs(customerId).resolves(customer);
      promotionsDao.findById.withArgs("2MonthPurchase").resolves(undefined);
      // act
      const result = await service.getPetGift(customerId, fakePromotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a promotion is finished", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const fakePromotionId = "2MonthPurchase";
      const promotionObj: any = {
        isFinished: true
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      promotionsDao.findById.withArgs("2MonthPurchase").resolves(promotionObj);
      // act
      const result = await service.getPetGift(customerId, fakePromotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a promotion has been redeemed", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
      };
      const redeemedPromotion: any = {
        customerId, promotionId
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs(customerId, "6MonthPurchase").resolves([redeemedPromotion]);
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a customer does not meet promotion requirements", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
        date: (new Date().setMonth(new Date().getMonth() - 6))
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs(customerId, "6MonthPurchase").resolves([]);
      customersDao.getRelatedPurchases.withArgs(customerId).resolves([]);
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return null when a customer does not have a pet", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const promotionId = "6MonthPurchase";
      const promotionObj: any = {
        isFinished: false,
        date: (new Date().setMonth(new Date().getMonth() - 6))
      };
      const relatedPurchase: any = {
        date: (new Date().setMonth(-7))
      };
      customersDao.findById.withArgs(customerId).resolves(customer);
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.getRelatedRedeemedPromotions.withArgs(customerId, "6MonthPurchase").resolves([]);
      customersDao.getRelatedPurchases.withArgs(customerId).resolves([relatedPurchase]);
      customersDao.getRelatedPets.withArgs(customerId).resolves([]);
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result).to.deep.equal(null);
    });

    it("should return a gift for a eligible customer", async () => {
      // arrange
      const customerId = "83a4fc32-6162-11ed-a35a-f3f38a18fb46";
      const promotionId = "6MonthPurchase";
      const customer: any = {
        id: "83a4fc32-6162-11ed-a35a-f3f38a18fb46"
      };
      const promotionObj: any = {
        isFinished: false,
        date: (new Date().setMonth(new Date().getMonth() - 6))
      };
      const relatedPurchase: any = {
        date: (new Date().setMonth(new Date().getMonth() - 8))
      };
      const relatedPet: any = {
        species: "dog",
        name: "berny"
      };
      promotionsDao.findById.withArgs("6MonthPurchase").resolves(promotionObj);
      customersDao.findById.withArgs(customerId).resolves(customer);
      customersDao.getRelatedRedeemedPromotions.withArgs(customerId, "6MonthPurchase").resolves([]);
      customersDao.getRelatedPurchases.withArgs(customerId).resolves([relatedPurchase]);
      customersDao.getRelatedPets.withArgs(customerId).resolves([relatedPet]);
      redeemedPromotionsDao.insert.withArgs({customerId, promotionId}).resolves();
      // act
      const result = await service.getPetGift(customerId, promotionId);
      // assert
      expect(result?.gift).to.deep.equal("dog Gift for berny");
    });
  });

});
