import { Brand } from "@/components/Brand";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    // Solid background on purpose: backdrop-filter would make the header the
    // containing block for the fixed-position mobile menu and collapse it.
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper">
      <div className="container-page flex h-[4.5rem] items-center justify-between">
        <Brand />
        <SiteNav />
      </div>
    </header>
  );
}
