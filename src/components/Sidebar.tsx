"use client";

import links from "@/utils/links";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../public/next.svg";
import { Button } from "./ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="py-4 px-8 bg-muted h-full">
      <Image alt="logo" src={Logo} className="mx-auto" />
      <div className="flex flex-col mt-20 gap-y-4">
        {links.map((link) => (
          <Button
            asChild
            key={link.href}
            variant={pathname === link.href ? "default" : "link"}
          >
            <Link href={link.href} className="flex items-center gap-x-2 ">
              {link.icon}
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
