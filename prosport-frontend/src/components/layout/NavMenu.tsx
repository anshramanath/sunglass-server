"use client";

import Link from "next/link";
import { CategoryNode } from "@/lib/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavMenu({ categories }: { categories: CategoryNode[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((cat) =>
          cat.children && cat.children.length > 0 ? (
            <NavigationMenuItem key={cat.id}>
              <NavigationMenuTrigger>{cat.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col w-40 p-1">
                  {cat.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/category/${cat.slug}/${child.slug}`}
                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={cat.id}>
              <Link href={`/category/${cat.slug}`} className={navigationMenuTriggerStyle()}>
                {cat.name}
              </Link>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
