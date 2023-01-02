import { genPrivKey } from "maci-crypto";
import { eddsa } from "circomlib";
import { User } from "../data/User";

const genKeyPair = () => {
  const prvKey = genPrivKey().toString();
  return [eddsa.prv2pub(prvKey), prvKey];
}

const createUser = (userName) => {
  return new User(userName, genKeyPair())
}

export { createUser }