import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection, PublicKey } from "@solana/web3.js";
import React, { useMemo, useState } from "react";
import idl from "../idl.json";

const { SystemProgram, Keypair } = web3;
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed",
};
const programID = new PublicKey(idl.metadata.address);

function App({ children }) {
  const [value, setValue] = useState("");
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState("");
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = process.env.NEXT_PUBLIC_ENDPOINT;
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  if (!wallet.connected) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <WalletMultiButton />
        {children}
      </div>
    );
  } else {
    return (
      <div className="App">
        <WalletDisconnectButton />
        {children}
      </div>
    );
  }
}

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const Wallet = ({ children }) => {
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App>{children}</App>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Wallet;
