import dynamic from "next/dynamic";
import Avatar from "../src/components/Avatar";


const RouteGaurd = dynamic(() => import("../src/components/RouteGaurd"), {
  ssr: false,
});

export default function Home() {
  return <RouteGaurd component={Avatar} />;
}
