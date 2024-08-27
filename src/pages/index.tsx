import Image from "next/image";
import { Inter } from "next/font/google";
import { CanvasClient, CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import CanvasClientWrapper from "@/components/CanvasClientComponent";
import SendTransaction from "@/components/SendTransaction";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
      <main className="text-white">
        <h1>Home Page</h1>
        <CanvasClientWrapper />
        <SendTransaction/>
      </main>
  );
}
