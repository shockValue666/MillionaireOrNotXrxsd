import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectEmojiProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const EmojiSelect = React.forwardRef<HTMLSelectElement, SelectEmojiProps>(
  ({ className, ...props }, ref) => {
    const emojiOptions = ["😀", "😃", "😄", "😁", "😆", "😅", "😂"]; // Example emojis

    return (
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}>
        {emojiOptions.map((emoji, index) => (
          <option key={index} value={emoji}>
            {emoji}
          </option>
        ))}
      </select>
    );
  }
);

EmojiSelect.displayName = "EmojiSelect";

export { EmojiSelect };