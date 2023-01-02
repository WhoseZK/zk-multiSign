
class User {
    constructor(keyPair) {
        this.keyPair = keyPair
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