import Image from "next/image";
import { Inter } from "next/font/google";
import { CanvasClient, CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import CanvasClientWrapper from "@/components/CanvasClientComponent";
import SendTransaction from "@/components/SendTransaction";
import Demo from "@/components/Demo";
import TransactionForm from "@/components/TransactionForm";
import { useCanvasClient } from "@/hooks/useCanvasClient";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  const { client, user, content, isReady } = useCanvasClient();
  console.log('client: ',client,'use : ',user,'content : ',content,'isReady : ',isReady);
  return (
      <main className="text-white">
        <h1>Home Page</h1>
        <CanvasClientWrapper />
        <Demo/>
        {/* <SendTransaction/> */}
        {client && <TransactionForm canvasClient={client}/>}
      </main>
  );
}
