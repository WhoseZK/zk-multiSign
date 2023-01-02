/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
        // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
      readline: false
    };

    return config;
  },
  // mock address
  env: {
    registryAddress: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    factoryAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    inclusionOfMemberVerifier: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
    updateMemberTreeVerifier: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
    zkMultiSignVerifier: "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
    multiSignByteCode: "0x60806040523480156200001157600080fd5b5060405162000ee238038062000ee28339818101604052810190620000379190620001a3565b8282826200004c83836200009960201b60201c565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050506200023d565b81600081905550806001819055507ff665d9e50fb6a414420fde27f46b7113ac5ec2e33820c770fb1e2fe0b7d2dfc4600054600154604051620000de92919062000210565b60405180910390a15050565b600080fd5b6000819050919050565b6200010481620000ef565b81146200011057600080fd5b50565b6000815190506200012481620000f9565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000157826200012a565b9050919050565b60006200016b826200014a565b9050919050565b6200017d816200015e565b81146200018957600080fd5b50565b6000815190506200019d8162000172565b92915050565b600080600060608486031215620001bf57620001be620000ea565b5b6000620001cf8682870162000113565b9350506020620001e28682870162000113565b9250506040620001f5868287016200018c565b9150509250925092565b6200020a81620000ef565b82525050565b6000604082019050620002276000830185620001ff565b620002366020830184620001ff565b9392505050565b610c95806200024d6000396000f3fe60806040526004361061002d5760003560e01c8063a2aef08714610036578063dbd7aa901461005f57610034565b3661003457005b005b34801561004257600080fd5b5061005d600480360381019061005891906107bb565b610088565b005b34801561006b57600080fd5b5061008660048036038101906100819190610890565b610340565b005b8181600054826000600281106100a1576100a061090c565b5b60200201351415806100cd5750600154826001600281106100c5576100c461090c565b5b602002013514155b15610104576040517ff299a39200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f5c9d69e6040518060400160405280846000600881106101615761016061090c565b5b602002013581526020018460016008811061017f5761017e61090c565b5b602002013581525060405180604001604052806040518060400160405280876002600881106101b1576101b061090c565b5b60200201358152602001876003600881106101cf576101ce61090c565b5b602002013581525081526020016040518060400160405280876004600881106101fb576101fa61090c565b5b60200201358152602001876005600881106102195761021861090c565b5b60200201358152508152506040518060400160405280866006600881106102435761024261090c565b5b60200201358152602001866007600881106102615761026061090c565b5b6020020135815250866040518563ffffffff1660e01b81526004016102899493929190610afd565b602060405180830381865afa1580156102a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102ca9190610b7c565b610300576040517f09bde33900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61033a846000600281106103175761031661090c565b5b6020020135856001600281106103305761032f61090c565b5b602002013561071e565b50505050565b8181600054826000600281106103595761035861090c565b5b602002013514158061038557506001548260016002811061037d5761037c61090c565b5b602002013514155b156103bc576040517ff299a39200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f5c9d69e6040518060400160405280846000600881106104195761041861090c565b5b60200201358152602001846001600881106104375761043661090c565b5b602002013581525060405180604001604052806040518060400160405280876002600881106104695761046861090c565b5b60200201358152602001876003600881106104875761048661090c565b5b602002013581525081526020016040518060400160405280876004600881106104b3576104b261090c565b5b60200201358152602001876005600881106104d1576104d061090c565b5b60200201358152508152506040518060400160405280866006600881106104fb576104fa61090c565b5b60200201358152602001866007600881106105195761051861090c565b5b6020020135815250866040518563ffffffff1660e01b81526004016105419493929190610afd565b602060405180830381865afa15801561055e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105829190610b7c565b6105b8576040517f09bde33900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff16036106955760008673ffffffffffffffffffffffffffffffffffffffff168660405161061290610bda565b60006040518083038185875af1925050503d806000811461064f576040519150601f19603f3d011682016040523d82523d6000602084013e610654565b606091505b505090508061068f576040517fa636a08b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50610715565b8673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb87876040518363ffffffff1660e01b81526004016106d0929190610c0d565b6020604051808303816000875af11580156106ef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107139190610b7c565b505b50505050505050565b81600081905550806001819055507ff665d9e50fb6a414420fde27f46b7113ac5ec2e33820c770fb1e2fe0b7d2dfc4600054600154604051610761929190610c36565b60405180910390a15050565b600080fd5b600080fd5b60008190508260206002028201111561079357610792610772565b5b92915050565b6000819050826020600802820111156107b5576107b4610772565b5b92915050565b60008061014083850312156107d3576107d261076d565b5b60006107e185828601610777565b92505060406107f285828601610799565b9150509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610827826107fc565b9050919050565b6108378161081c565b811461084257600080fd5b50565b6000813590506108548161082e565b92915050565b6000819050919050565b61086d8161085a565b811461087857600080fd5b50565b60008135905061088a81610864565b92915050565b60008060008060006101a086880312156108ad576108ac61076d565b5b60006108bb88828901610845565b95505060206108cc88828901610845565b94505060406108dd8882890161087b565b93505060606108ee88828901610777565b92505060a06108ff88828901610799565b9150509295509295909350565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600060029050919050565b600081905092915050565b6000819050919050565b6109648161085a565b82525050565b6000610976838361095b565b60208301905092915050565b6000602082019050919050565b6109988161093b565b6109a28184610946565b92506109ad82610951565b8060005b838110156109de5781516109c5878261096a565b96506109d083610982565b9250506001810190506109b1565b505050505050565b600060029050919050565b600081905092915050565b6000819050919050565b600081905092915050565b610a1a8161093b565b610a248184610a06565b9250610a2f82610951565b8060005b83811015610a60578151610a47878261096a565b9650610a5283610982565b925050600181019050610a33565b505050505050565b6000610a748383610a11565b60408301905092915050565b6000602082019050919050565b610a96816109e6565b610aa081846109f1565b9250610aab826109fc565b8060005b83811015610adc578151610ac38782610a68565b9650610ace83610a80565b925050600181019050610aaf565b505050505050565b82818337505050565b610af960408383610ae4565b5050565b600061014082019050610b13600083018761098f565b610b206040830186610a8d565b610b2d60c083018561098f565b610b3b610100830184610aed565b95945050505050565b60008115159050919050565b610b5981610b44565b8114610b6457600080fd5b50565b600081519050610b7681610b50565b92915050565b600060208284031215610b9257610b9161076d565b5b6000610ba084828501610b67565b91505092915050565b600081905092915050565b50565b6000610bc4600083610ba9565b9150610bcf82610bb4565b600082019050919050565b6000610be582610bb7565b9150819050919050565b610bf88161081c565b82525050565b610c078161085a565b82525050565b6000604082019050610c226000830185610bef565b610c2f6020830184610bfe565b9392505050565b6000604082019050610c4b6000830185610bfe565b610c586020830184610bfe565b939250505056fea264697066735822122045112651b6bc68e9dc4d9539f3de204c1414fe297635213582bcbde70ca1ccb564736f6c63430008110033",
    mockErc20ByteCode: "0x60806040523480156200001157600080fd5b50604051620019ba380380620019ba8339818101604052810190620000379190620002cd565b6040518060400160405280600981526020017f4d6f636b455243323000000000000000000000000000000000000000000000008152506040518060400160405280600681526020017f4d455243323000000000000000000000000000000000000000000000000000008152508160039081620000b4919062000579565b508060049081620000c6919062000579565b505050620000e58169d3c21bcecceda1000000620000ec60201b60201c565b506200077b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200015e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200015590620006c1565b60405180910390fd5b62000172600083836200025960201b60201c565b806002600082825462000186919062000712565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200023991906200075e565b60405180910390a362000255600083836200025e60201b60201c565b5050565b505050565b505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620002958262000268565b9050919050565b620002a78162000288565b8114620002b357600080fd5b50565b600081519050620002c7816200029c565b92915050565b600060208284031215620002e657620002e562000263565b5b6000620002f684828501620002b6565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200038157607f821691505b60208210810362000397576200039662000339565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620003c2565b6200040d8683620003c2565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200045a620004546200044e8462000425565b6200042f565b62000425565b9050919050565b6000819050919050565b620004768362000439565b6200048e620004858262000461565b848454620003cf565b825550505050565b600090565b620004a562000496565b620004b28184846200046b565b505050565b5b81811015620004da57620004ce6000826200049b565b600181019050620004b8565b5050565b601f8211156200052957620004f3816200039d565b620004fe84620003b2565b810160208510156200050e578190505b620005266200051d85620003b2565b830182620004b7565b50505b505050565b600082821c905092915050565b60006200054e600019846008026200052e565b1980831691505092915050565b60006200056983836200053b565b9150826002028217905092915050565b6200058482620002ff565b67ffffffffffffffff811115620005a0576200059f6200030a565b5b620005ac825462000368565b620005b9828285620004de565b600060209050601f831160018114620005f15760008415620005dc578287015190505b620005e885826200055b565b86555062000658565b601f19841662000601866200039d565b60005b828110156200062b5784890151825560018201915060208501945060208101905062000604565b868310156200064b578489015162000647601f8916826200053b565b8355505b6001600288020188555050505b505050505050565b600082825260208201905092915050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6000620006a9601f8362000660565b9150620006b68262000671565b602082019050919050565b60006020820190508181036000830152620006dc816200069a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200071f8262000425565b91506200072c8362000425565b9250828201905080821115620007475762000746620006e3565b5b92915050565b620007588162000425565b82525050565b60006020820190506200077560008301846200074d565b92915050565b61122f806200078b6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610b0c565b60405180910390f35b6100e660048036038101906100e19190610bc7565b610308565b6040516100f39190610c22565b60405180910390f35b61010461032b565b6040516101119190610c4c565b60405180910390f35b610134600480360381019061012f9190610c67565b610335565b6040516101419190610c22565b60405180910390f35b610152610364565b60405161015f9190610cd6565b60405180910390f35b610182600480360381019061017d9190610bc7565b61036d565b60405161018f9190610c22565b60405180910390f35b6101b260048036038101906101ad9190610cf1565b6103a4565b6040516101bf9190610c4c565b60405180910390f35b6101d06103ec565b6040516101dd9190610b0c565b60405180910390f35b61020060048036038101906101fb9190610bc7565b61047e565b60405161020d9190610c22565b60405180910390f35b610230600480360381019061022b9190610bc7565b6104f5565b60405161023d9190610c22565b60405180910390f35b610260600480360381019061025b9190610d1e565b610518565b60405161026d9190610c4c565b60405180910390f35b60606003805461028590610d8d565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610d8d565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610770565b6103588585856107fc565b60019150509392505050565b60006012905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610ded565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610d8d565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610e93565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fc565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610616576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060d90610f25565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610685576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067c90610fb7565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107639190610c4c565b60405180910390a3505050565b600061077c8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f657818110156107e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107df90611023565b60405180910390fd5b6107f584848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610862906110b5565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d190611147565b60405180910390fd5b6108e5838383610a72565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610962906111d9565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a599190610c4c565b60405180910390a3610a6c848484610a77565b50505050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ab6578082015181840152602081019050610a9b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610ade82610a7c565b610ae88185610a87565b9350610af8818560208601610a98565b610b0181610ac2565b840191505092915050565b60006020820190508181036000830152610b268184610ad3565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b5e82610b33565b9050919050565b610b6e81610b53565b8114610b7957600080fd5b50565b600081359050610b8b81610b65565b92915050565b6000819050919050565b610ba481610b91565b8114610baf57600080fd5b50565b600081359050610bc181610b9b565b92915050565b60008060408385031215610bde57610bdd610b2e565b5b6000610bec85828601610b7c565b9250506020610bfd85828601610bb2565b9150509250929050565b60008115159050919050565b610c1c81610c07565b82525050565b6000602082019050610c376000830184610c13565b92915050565b610c4681610b91565b82525050565b6000602082019050610c616000830184610c3d565b92915050565b600080600060608486031215610c8057610c7f610b2e565b5b6000610c8e86828701610b7c565b9350506020610c9f86828701610b7c565b9250506040610cb086828701610bb2565b9150509250925092565b600060ff82169050919050565b610cd081610cba565b82525050565b6000602082019050610ceb6000830184610cc7565b92915050565b600060208284031215610d0757610d06610b2e565b5b6000610d1584828501610b7c565b91505092915050565b60008060408385031215610d3557610d34610b2e565b5b6000610d4385828601610b7c565b9250506020610d5485828601610b7c565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610da557607f821691505b602082108103610db857610db7610d5e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df882610b91565b9150610e0383610b91565b9250828201905080821115610e1b57610e1a610dbe565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000610e7d602583610a87565b9150610e8882610e21565b604082019050919050565b60006020820190508181036000830152610eac81610e70565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000610f0f602483610a87565b9150610f1a82610eb3565b604082019050919050565b60006020820190508181036000830152610f3e81610f02565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000610fa1602283610a87565b9150610fac82610f45565b604082019050919050565b60006020820190508181036000830152610fd081610f94565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b600061100d601d83610a87565b915061101882610fd7565b602082019050919050565b6000602082019050818103600083015261103c81611000565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b600061109f602583610a87565b91506110aa82611043565b604082019050919050565b600060208201905081810360008301526110ce81611092565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000611131602383610a87565b915061113c826110d5565b604082019050919050565b6000602082019050818103600083015261116081611124565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b60006111c3602683610a87565b91506111ce82611167565b604082019050919050565b600060208201905081810360008301526111f2816111b6565b905091905056fea2646970667358221220c2ee1e00d6f5fafb36e76627db069e2fab6483552673fa2c58629617480cd13064736f6c63430008110033"
  }
};

module.exports = nextConfig;
