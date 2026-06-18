import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/landing/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}
