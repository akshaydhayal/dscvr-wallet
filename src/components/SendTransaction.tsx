import { PublicKey } from '@solana/web3.js'
import React, { useState } from 'react'
import {createSendSolTranaction} from "../pages/api/solana";
import * as bs58 from "bs58";
import { CanvasInterface } from '@dscvr-one/canvas-client-sdk';
import { useCanvasClient } from '@/hooks/useCanvasClient';
// import a from "../../src/pages/"

const SendTransaction = () => {
const { client, user, content, isReady } = useCanvasClient();

  const [senderAddress,setSenderAddress]=useState<string>()
  const [recieverAddress,setRecieverAddress]=useState<string>()
  const [amount,setAmount]=useState<number>()
  const [errorMessage,setErrorMessage]=useState<string>()
  const [successfulSignedTx, setSuccessfulSignedTx]=useState<string>();

  const createTx=async(response:CanvasInterface.User.ConnectWalletResponse):Promise<CanvasInterface.User.UnsignedTransaction | undefined>=>{ 
    if(!response.untrusted.success){
        setErrorMessage('Failed to connect to wallet')
    }
    
    //@ts-ignore
    setSenderAddress(response.untrusted.address);
    if(!senderAddress || !recieverAddress || !amount){
        setErrorMessage("Please fill all the fields")
        return;
    }
    const senderPublickey=new PublicKey(senderAddress);
    const recieverPublickey=new PublicKey(recieverAddress);
    const transaction = await createSendSolTranaction(senderPublickey,recieverPublickey,amount)
  
    console.log('tx recieved from createSendSol fn : ',transaction);
    if(!transaction){
        setErrorMessage("Failed to create the send transaction");
        return;
    }
    const unsignedTx=bs58.default.encode(transaction.serialize())
    console.log('unsigned tx generated : ',unsignedTx);
    return{unsignedTx};
}

  async function sendTransaction(){
    const response=await client?.connectWalletAndSendTransaction('solamna:103',createTx);
    if(!response){
        setErrorMessage('Transaction not executed!');
        return;
    }
    console.log(response);
    if(response.untrusted.success){
        setSuccessfulSignedTx(response.untrusted.signedTx);
    }else if(response.untrusted.errorReason=="user-cancelled"){
        setErrorMessage('Transaction cancelled by user');
    }else{
         setErrorMessage(response.untrusted.error || "Unknown error");
    }
  }

  function handleSend(){
    setErrorMessage("");
    setSuccessfulSignedTx(undefined);
    sendTransaction();
  }

  return (
    <div>
        <h1>Send Transaction</h1>
        {successfulSignedTx? 
            <div className='flex flex-col gap-4'>
                <p>Transaction Signed Successfully!</p>
                <p>Transaction Hash: {successfulSignedTx}</p>
            </div>:
            <div className='flex flex-col gap-4 w-full'>
                <p className='text-lg'>Sender pub key : {senderAddress}</p>
                <input className='p-2 px-4 w-full' type='text' placeholder='enter reciever key' value={recieverAddress} onChange={(e)=>{
                    setRecieverAddress(e.target.value);
                }}/>
                <input className='p-2 px-4 w-full' type='number' placeholder='enter reciever key' value={amount} onChange={(e)=>{
                    setAmount(Number(e.target.value));
                }}/>
                <button className='p-1 px-4 border' onClick={()=>{
                    handleSend()
                }}>Send</button>
            </div>
        }
    </div>
  )
}

export default SendTransaction