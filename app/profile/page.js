
import dynamic from "next/dynamic";
import Profile from "../src/components/Profile";

const RouteGaurd = dynamic(() => import("../src/components/RouteGaurd"), {
  ssr: false,
});

export default function Home() {
  return <RouteGaurd component={Profile} />;
}
