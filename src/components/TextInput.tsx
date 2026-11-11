import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, ReactNode } from "react";

interface ChildrenProps {
  children: ReactNode;
}

function TextInputRoot({ children }: ChildrenProps) {
  return (
    <label className="flex h-11 w-full cursor-text items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 transition focus-within:border-white/20 focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-red-400/40">
      {children}
    </label>
  );
}

function TextInputIcon({ children }: ChildrenProps) {
  return <Slot className="size-5 shrink-0 text-zinc-400">{children}</Slot>;
}

function TextInputInput(props: ComponentProps<"input">) {
  return (
    <input
      className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-hidden placeholder:text-zinc-500"
      {...props}
    />
  );
}

export const TextInput = {
  Root: TextInputRoot,
  Icon: TextInputIcon,
  Input: TextInputInput,
};
