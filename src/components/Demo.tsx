import { createSendSolTranaction } from '@/pages/api/solana'
import { PublicKey } from '@solana/web3.js';
import React from 'react'

const Demo = () => {
    const pub1 = new PublicKey("ADMdaJvSZYYYJkgZPj68GYQ2n9fVfTFRvmVcxXfVRkx7");
    const pub2 = new PublicKey("AmZrDPxbdPM2XXetxQjusHxGUwG3kQiEpm4Kv6RqUKHN");
    async function createTx(){
        const response = await createSendSolTranaction(pub1, pub2,5900);
        console.log('sendSol fn response : ',response);
    }
    createTx();
    return (
    <div>
        <p>Demo</p>
        <p>Transaction Response</p>
    </div>
  )
}

export default Demo