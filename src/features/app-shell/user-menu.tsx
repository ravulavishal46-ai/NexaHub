"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UserMenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
  separatorBefore?: boolean;
}

export function UserMenu({
  name,
  email,
  items,
  roleBadge,
}: {
  name: string;
  email: string;
  items: UserMenuItem[];
  roleBadge?: ReactNode;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/40 data-[state=open]:bg-accent">
        <Avatar name={name} className="size-8" />
        <span className="hidden max-w-32 truncate text-sm font-medium md:block">{name}</span>
        <ChevronDown className="hidden size-4 text-muted-foreground md:block" aria-hidden />
        <span className="sr-only">Open account menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{name}</p>
            {roleBadge}
          </div>
          <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => {
          const content = (
            <>
              <item.icon /> {item.label}
            </>
          );
          return (
            <Fragment key={item.label}>
              {item.separatorBefore && <DropdownMenuSeparator />}
              {item.href ? (
                <DropdownMenuItem asChild variant={item.destructive ? "destructive" : undefined}>
                  <Link href={item.href}>{content}</Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={item.onSelect} variant={item.destructive ? "destructive" : undefined}>
                  {content}
                </DropdownMenuItem>
              )}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
