
class User {
    constructor(userName, keyPair) {
        this.userName = userName;
        this.keyPair = keyPair;
    }

    updateTreeDetail(treeResult) {
        this.siblings = treeResult.siblings;
        this.index = treeResult.index;
        this.root = treeResult.root
    }

    updatePoint(point) {
        this.point = [point.x, point.y]
    }
}

export { User };