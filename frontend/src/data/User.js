
class User {
    constructor(userName, keyPair) {
        this.userName = userName;
        this.keyPair = keyPair;
    }

    updateTreeDetail(treeResult, root, index) {
        this.siblings = treeResult.siblings;
        this.index = index;
        this.root = root
    }

    updatePoint(point) {
        this.point = [point.x, point.y]
    }
}

export { User };