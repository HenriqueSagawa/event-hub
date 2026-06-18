import { SiteHeader } from "@/components/site-header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
    </div>
  );
}
