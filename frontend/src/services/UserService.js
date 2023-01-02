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
     const tempUser = JSON.parse(localStorage.getItem(username));
     const user = new User(tempUser.userName, tempUser.keyPair);
     user.old = true;
     return user;
  }

  const user = new User(username, genKeyPair());
  localStorage.setItem(username, JSON.stringify(user));
  return user
}

export { createUser }