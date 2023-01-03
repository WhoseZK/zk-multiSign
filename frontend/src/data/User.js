
class User {
    constructor(userName, keyPair) {
        this.userName = userName;
        this.keyPair = keyPair;
    }

    updateTreeDetail(treeResult, root, index) {
        this.siblings = treeResult.siblings.map(sibling => sibling.toString());
        this.index = index.toString();
        this.root = root.toString();
    }

    updatePoint(point) {
        this.point = [point.x.toString(), point.y.toString()]
    }
}

export { User };