import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Hardhat;

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      desiredChainId={activeChainId}
      chainRpc={{ [ChainId.Hardhat]: "http://localhost:8545" }}
      sdkOptions={{
        readonlySettings: {
          chainId: ChainId.Hardhat,
          rpcUrl: "http://localhost:8545",
        },
      }}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
