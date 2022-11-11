import "reflect-metadata";
import { Container } from "inversify";
// injections
import Customer from "./model/Customer";
import Pet from "./model/Pet";
import Promotion from "./model/Promotion";
import RedeemedPromotion from "./model/RedeemedPromotion";

import setupDb from "./db/db-setup";
setupDb();

const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
});

container.bind("Customer").toConstantValue(Customer);
container.bind("Pet").toConstantValue(Pet);
container.bind("Promotion").toConstantValue(Promotion);
container.bind("RedeemedPromotion").toConstantValue(RedeemedPromotion);


export { container };
