"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { VeteranBadge } from "@/components/Brand";
import { mainNav, serviceNav, site } from "@/content/site";

type Panel = "services" | "mobile";

export function SiteNav() {
  const pathname = usePathname();
  // Open state is keyed to the pathname, so menus close on navigation.
  const [open, setOpen] = useState<{ panel: Panel; path: string } | null>(null);
  const current = open?.path === pathname ? open.panel : null;
  const navRef = useRef<HTMLDivElement>(null);

  const toggle = (panel: Panel) => setOpen(current === panel ? null : { panel, path: pathname });
  const close = () => setOpen(null);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    if (current === "mobile") document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.documentElement.style.overflow = "";
    };
  }, [current]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const servicesActive = serviceNav.some((s) => isActive(s.href)) || pathname === "/services";

  return (
    <div ref={navRef} className="flex items-center">
      {/* Desktop */}
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          <li className="relative">
            <button
              type="button"
              aria-expanded={current === "services"}
              aria-controls="services-menu"
              onClick={() => toggle("services")}
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:bg-sand ${servicesActive ? "text-accent" : "text-ink"}`}
            >
              Services
              <ChevronDown className={`size-4 transition-transform ${current === "services" ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <div
              id="services-menu"
              hidden={current !== "services"}
              className="absolute left-1/2 top-full z-50 mt-3 w-[34rem] -translate-x-1/2 rounded-2xl border border-line bg-white p-3 shadow-lift"
            >
              <ul className="grid grid-cols-2 gap-1">
                {serviceNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="block rounded-xl p-3 transition-colors hover:bg-sand aria-[current=page]:bg-accent-tint"
                    >
                      <span className="block font-semibold text-ink">{item.label}</span>
                      <span className="mt-0.5 block text-sm text-muted">{item.description}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" onClick={close} className="flex h-full items-center rounded-xl p-3 font-semibold text-accent transition-colors hover:bg-sand">
                    View all services →
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-sand aria-[current=page]:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-4 hidden items-center gap-3 lg:flex">
        <a
          href={`tel:${site.contact.phoneE164}`}
          data-track-location="header"
          className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent xl:text-[0.9375rem]"
        >
          <Phone className="size-4" aria-hidden="true" />
          <span className="hidden xl:inline">{site.contact.phoneDisplay}</span>
          <span className="sr-only xl:hidden">Call {site.contact.phoneDisplay}</span>
        </a>
        <Link href="/contact" className="btn btn-primary !min-h-11 !px-5">
          Request a consultation
        </Link>
      </div>

      <VeteranBadge className="mr-3 h-12 lg:ml-4 lg:mr-0 lg:hidden xl:block" />

      {/* Mobile */}
      <button
        type="button"
        className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink hover:bg-sand lg:hidden"
        aria-expanded={current === "mobile"}
        aria-controls="mobile-menu"
        onClick={() => toggle("mobile")}
      >
        {current === "mobile" ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        <span className="sr-only">{current === "mobile" ? "Close menu" : "Open menu"}</span>
      </button>

      <div
        id="mobile-menu"
        hidden={current !== "mobile"}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Services</p>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} aria-current={isActive(item.href) ? "page" : undefined} className="block py-3.5 aria-[current=page]:text-accent">
                  <span className="block font-semibold">{item.label}</span>
                  <span className="block text-sm text-muted">{item.description}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" onClick={close} className="block py-3.5 font-semibold text-accent">
                All services
              </Link>
            </li>
          </ul>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} aria-current={isActive(item.href) ? "page" : undefined} className="block py-3.5 text-lg font-medium aria-[current=page]:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href="/contact" onClick={close} className="btn btn-primary w-full">
              Request a consultation
            </Link>
            <a href={`tel:${site.contact.phoneE164}`} data-track-location="mobile-menu" className="btn btn-secondary w-full">
              <Phone className="size-4" aria-hidden="true" /> Call {site.contact.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
