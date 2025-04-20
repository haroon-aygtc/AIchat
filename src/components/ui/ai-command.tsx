import { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AICommandProps = {
  className?: string;
  placeholder?: string;
  suggestions?: string[];
  onSelect?: (value: string) => void;
  onInputChange?: (value: string) => void;
};

export const AICommand = ({
  className,
  placeholder = "Type a command or search...",
  suggestions = [],
  onSelect,
  onInputChange,
}: AICommandProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Simulate AI-generated suggestions based on input
  useEffect(() => {
    if (inputValue.length > 0) {
      // In a real app, this would call an API to get AI suggestions
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase()),
      );

      // Add some "AI-generated" suggestions
      const aiGenerated = [
        `Analyze "${inputValue}"`,
        `Create report about "${inputValue}"`,
        `Find patterns in "${inputValue}"`,
      ];

      setAiSuggestions([...filtered, ...aiGenerated]);
    } else {
      setAiSuggestions(suggestions);
    }
  }, [inputValue, suggestions]);

  return (
    <Command
      className={cn("rounded-lg border shadow-md bg-background", className)}
    >
      <div className="flex items-center border-b px-3 relative">
        <Sparkles className="mr-2 h-4 w-4 shrink-0 text-primary" />
        <CommandInput
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none"
          placeholder={placeholder}
          value={inputValue}
          onValueChange={(value) => {
            setInputValue(value);
            if (onInputChange) onInputChange(value);
          }}
        />
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {aiSuggestions.map((suggestion, index) => (
            <CommandItem
              key={index}
              onSelect={() => {
                if (onSelect) onSelect(suggestion);
              }}
              className="flex items-center gap-2 hover:bg-primary/10"
            >
              {suggestion.startsWith("Analyze") ||
              suggestion.startsWith("Create") ||
              suggestion.startsWith("Find") ? (
                <Sparkles className="h-3 w-3 text-primary" />
              ) : null}
              {suggestion}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
