"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import Spinner from "@/components/Loaders/spinner";
import { useLayoutStore } from "@/providers/layout";

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export default function GlobalNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoading = useLayoutStore((store) => store.globalLoading);
  const setGlobalLoading = useLayoutStore((store) => store.setGlobalLoading);

  useEffect(() => {
    setGlobalLoading(false);
  }, [pathname, searchParams, setGlobalLoading]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href || !isInternalHref(href)) return;
      if (href.startsWith("#")) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;
      if (href === pathname) return;

      setGlobalLoading(true);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname, setGlobalLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 backdrop-blur-[2px]">
      <Spinner />
    </div>
  );
}