import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>DSCVR Example Canvas - Next.js</title>
        <meta name="description" content="DSCVR Example Canvas - Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="dscvr:canvas:version" content="vNext" />

        {/* <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; 
             script-src 'self' 'unsafe-eval'; 
             style-src 'self' 'unsafe-inline'; 
             img-src cdn.dummyjson.com https://ipfs.dscvr.one https://media.dscvr.one https://media1.stg.dscvr.one data:; 
             connect-src 'self' https://dummyjson.com/  https://api.dscvr.one https://api1.stg.dscvr.one https://*.helius-rpc.com ; 
             font-src 'self';
             "
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
