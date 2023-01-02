import { genPrivKey } from "maci-crypto";
import { User } from "../data/User";
 
const genKeyPair = () => {
  const prvKey = genPrivKey().toString();
  return [ eddsa.prv2pub(prvKey), prvKey]
}

const createUser = (userName) => {

  if (localStorage.getItem(userName)) {
    return JSON.parse(localStorage.getItem(userName))
  }

  return new User(genKeyPair())
}

module.exports = { createUser }