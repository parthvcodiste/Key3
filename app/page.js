import dynamic from "next/dynamic";
import WalletConnect from "./src/components/WalletConnect";

const PublicRoute = dynamic(() => import("./src/components/PublicRoute"), {
  ssr: false,
});

export default function Home() {
  return <PublicRoute component={WalletConnect} />;
}
