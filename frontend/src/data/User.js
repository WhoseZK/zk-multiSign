
class User {
    constructor(userName, keyPair) {
        this.userName = userName;
        this.keyPair = keyPair;
        this.approve = false;
    }

    updateTreeDetail(treeResult, root, index) {
        this.siblings = treeResult.siblings.map(sibling => sibling.toString());
        this.index = index.toString();
        this.root = root.toString();
    }

    updatePoint(point) {
        this.point = [point.x.toString(), point.y.toString()]
    }

    updateApprove(signature) {
        const sigStringify = {
            S: signature.S.toString(),
            R8: signature.R8.map(axis => axis.toString())
        }
        this.approve = true;
        this.sig = sigStringify;
    }

    updateZkpInputs(zkpInputs) {
        this.zkpInputs = zkpInputs;
    }
}

export { User };