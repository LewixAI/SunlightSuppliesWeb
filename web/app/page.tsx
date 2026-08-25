import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import ClientWall from "@/components/client-wall";
import BuildSequence from "@/components/build-sequence";
import Systems from "@/components/systems";
import Installed from "@/components/installed";
import Retail from "@/components/retail";
import Process from "@/components/process";
import Contact from "@/components/contact";
import SiteFooter from "@/components/site-footer";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ClientWall />
        <BuildSequence />
        <Systems />
        <Installed />
        <Retail />
        <Process />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
