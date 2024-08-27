import React, { useState, useEffect } from "react";
import { CanvasClient, CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import * as bs58 from "bs58";
import { createSendSolTranaction } from "../pages/api/solana";
import { PublicKey, Cluster } from "@solana/web3.js";
// import { validateHostMessage } from "@/api/dscvr";

type ClusterInfo = {
  name: string;
  cluster: Cluster;
  chainId: string;
  appUrl?: string;
};

type Props = {
  canvasClient: CanvasClient;
//   onSuccess: (signedTx: string) => void;
};

const clusterList: ClusterInfo[] = [
  { name: "Devnet", cluster: "devnet", chainId: "solana:103" },
  {name: "Mainnet",cluster: "mainnet-beta",chainId: "solana:101",appUrl: process.env.VITE_SOLANA_MAINNET_CLUSTER,},
];

// const TransactionForm: React.FC<Props> = ({ canvasClient, onSuccess }) => {
const TransactionForm: React.FC<Props> = ({ canvasClient}) => {
  const [clusterInfo, setClusterInfo] = useState<ClusterInfo>(clusterList[0]);
  const [sourceAddress, setSourceAddress] = useState<string>();
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [token, setToken] = useState<string>("SOL");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successfulSignedTx, setSuccessfulSignedTx] = useState<string>();

  const openTransactionLink = () => {
    if (!successfulSignedTx) return;
    const url = `https://solana.fm/tx/${successfulSignedTx}`;
    canvasClient.openLink(url);
  };

  const createTx = async (response: CanvasInterface.User.ConnectWalletResponse): Promise<CanvasInterface.User.UnsignedTransaction | undefined> => {
    // const isValidResponse = await validateHostMessage(response);
    // if (!isValidResponse) {
    //   setErrorMessage("Security error");
    //   return;
    // }

    if (!response.untrusted.success) {
      setErrorMessage("Failed to connect wallet");
      return;
    }
    if (!targetAddress || !amount || !token) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setSourceAddress(response.untrusted.address);
    const sourceAddressPublicKey = new PublicKey(response.untrusted.address);
    const targetAddressPublicKey = new PublicKey(targetAddress);
    // const transaction = await createSendSolTranaction(clusterInfo.cluster, amount, sourceAddressPublicKey, targetAddressPublicKey, clusterInfo.appUrl);
    const transaction = await createSendSolTranaction(sourceAddressPublicKey, targetAddressPublicKey, amount);

    if (!transaction) {
      setErrorMessage("Failed to create send transaction");
      return;
    }

    const unsignedTx = bs58.default.encode(transaction.serialize());
    return { unsignedTx };
  };

  const sendTransaction = async () => {
    const response = await canvasClient.connectWalletAndSendTransaction(clusterInfo.chainId, createTx);

    if (!response) {
      setErrorMessage("Transaction not executed");
      return;
    }

    // const isValidResponse = await validateHostMessage(response);
    // if (!isValidResponse) {
    //   setErrorMessage("Security error");
    //   return;
    // }

    if (response.untrusted.success) {
      setSuccessfulSignedTx(response.untrusted.signedTx);
      onSuccess(response.untrusted.signedTx);
    } else if (response.untrusted.errorReason === "user-cancelled") {
      setErrorMessage("User cancelled transaction");
    } else {
      setErrorMessage(response.untrusted.error || "Unknown error");
    }
  };

  const clear = () => {
    setErrorMessage("");
    setSuccessfulSignedTx(undefined);
    setSourceAddress(undefined);
    setTargetAddress("");
    setAmount(undefined);
    setClusterInfo(clusterList[0]);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessfulSignedTx(undefined);
    sendTransaction();
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      {successfulSignedTx ? (
        <>
          <p className="text-2xl text-green-500">Transaction sent successfully</p>
          <a href="#" className="text-indigo-400 hover:underline" onClick={openTransactionLink}>
            Open in Solana.fm
          </a>
          <button
            onClick={clear}
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded"
          >
            Close
          </button>
        </>
      ) : (
        <form className="flex flex-col justify-center items-center gap-6 w-screen p-10" onSubmit={submit}>
          <h2 className="text-2xl">Send Transaction</h2>
          {sourceAddress && (
            <div className="flex items-center gap-4 w-full">
              <label className="min-w-28">Source Address</label>
              <span className="flex-1 text-gray-400">{sourceAddress}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <label htmlFor="target" className="min-w-28">
              Target address
            </label>
            <input
              type="text"
              name="target"
              className="flex-1 text-gray-700 border border-gray-700 rounded-xl w-full"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <label htmlFor="amount" className="min-w-28">
              Amount (SOL)
            </label>
            <input
              type="number"
              name="amount"
              className="flex-1 text-gray-700 border border-gray-700 rounded-xl w-full"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              step="0.000000001"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {clusterList.map((clusterItem) => (
              <button
                key={clusterItem.cluster}
                type="submit"
                className={`text-white font-bold py-2 px-4 border-b-4 rounded ${
                  clusterItem.cluster === "mainnet-beta"
                    ? "bg-amber-500 hover:bg-amber-400 border-amber-700 hover:border-amber-500"
                    : "bg-gray-500 hover:bg-gray-400 border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => setClusterInfo(clusterItem)}
              >
                Send ({clusterItem.name})
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
