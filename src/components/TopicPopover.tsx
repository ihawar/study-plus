import { useAuth } from "@/context/AuthContext";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types/db";

type TopicPopoverProps = {
  topics: Array<Topic>;
  setTopics: React.Dispatch<React.SetStateAction<Array<Topic>>>;
  selected: Topic | null;
  setSelected: (topic: Topic) => void;
};

export default function TopicPopover({
  topics,
  setTopics,
  selected,
  setSelected,
}: TopicPopoverProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("user_id", user.id);
      if (!error && data) {
        setTopics(data);
      }
    };
    fetchTopics();

    // realtime subscription for topics
    const channel = supabase
      .channel("topics_insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "topics",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setTopics((prev: Array<Topic>) => {
            if (!payload?.new) return prev;
            if (prev.some((topic) => topic.id === payload.new.id)) return prev;
            return [...prev, payload.new as Topic];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, setTopics]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between items-center text-gray-600 border-2  border-gray-400 text-sm md:text-base py-2 px-4 bg-white rounded-lg focus:border-green-400 hover:text-gray-600"
        >
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ backgroundColor: selected?.color }}
          />
          {selected?.title || "Select topic..."}
          <ChevronsUpDownIcon className="ml-4 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No topic found.</CommandEmpty>
            <CommandGroup>
              {topics.map((topic) => (
                <CommandItem
                  key={topic.id}
                  value={topic.id.toString()}
                  onSelect={() => {
                    setSelected(topic);
                    setOpen(false);
                  }}
                  className="text-gray-600"
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === topic ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: topic.color }}
                  />
                  {topic.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
