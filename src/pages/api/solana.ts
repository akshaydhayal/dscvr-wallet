import {clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction, TransactionMessage, VersionedMessage, VersionedTransaction} from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

const connection=new Connection(clusterApiUrl("devnet"),"confirmed");

// export default async function getTransaction(req:NextApiRequest,res:NextApiResponse){
export async function getTransaction(txId:string){
    const txStatus = await connection.getParsedTransaction(txId,{
        commitment:"confirmed",
        maxSupportedTransactionVersion:0
    });
    return txStatus;
    // const blockhash=await connection.getLatestBlockhash('confirmed');
    // return res.status(201).json(blockhash)
}

export async function createSendSolTranaction(senderPub:PublicKey,recieverPub:PublicKey,amount:number){
    const tx=new Transaction();
    tx.add(SystemProgram.transfer({
        fromPubkey:senderPub,toPubkey:recieverPub,lamports:amount
    }));
    const latestBlockhash=await connection.getLatestBlockhash('confirmed');
    const messageV0=new TransactionMessage({
        payerKey:senderPub,
        instructions:tx.instructions,
        recentBlockhash:latestBlockhash.blockhash
    }).compileToV0Message()

    return new VersionedTransaction(messageV0);
}