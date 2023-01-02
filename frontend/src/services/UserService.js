import { genPrivKey } from "maci-crypto";
import { eddsa } from "circomlib";
import { User } from "../data/User";

const genKeyPair = () => {
  const prvKey = genPrivKey().toString();
  const pubKey = eddsa.prv2pub(prvKey).map(each => each.toString());
  return [pubKey, prvKey];
}

const createUser = (username) => {

  if (localStorage.getItem(username)) {
     const user = JSON.parse(localStorage.getItem(username));
     user.old = true;
     return user;
  }

  const user = new User(username, genKeyPair());
  localStorage.setItem(username, JSON.stringify(user));
  return user
}

export { createUser }