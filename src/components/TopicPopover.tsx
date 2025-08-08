import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { HiChevronUpDown } from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/utils/supabase";
import type { Topic } from "@/types/db";
import { MdOutlineDelete } from "react-icons/md";
import { useAlert } from "@/context/AlertContext";

type TopicPopoverProps = {
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  selected: Topic | null;
  setSelected: (topic: Topic | null) => void;
};

export default function TopicPopover({
  topics,
  setTopics,
  selected,
  setSelected,
}: TopicPopoverProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const { showAlert } = useAlert();

  async function deleteTopic(topicId: number) {
    const { error } = await supabase.from("topics").delete().eq("id", topicId);

    if (error) {
      showAlert(`Failed to delete topic: ${error.message}`, "error");
    } else {
      showAlert("Topic deleted.", "success");
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
      if (selected?.id === topicId) setSelected(null);
    }
  }

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

    // Realtime subscription for topics table
    const channel = supabase
      .channel("topics-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "topics",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setTopics((prev) => {
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

  const filteredTopics =
    query === ""
      ? topics
      : topics.filter((topic) =>
          topic.title.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative flex items-center h-full w-full">
        <div
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{ backgroundColor: selected?.color || "transparent" }}
        />
        <ComboboxInput
          className="w-full bg-white border-gray-400 border-2 rounded-lg py-2 px-3 pl-10 text-gray-600 text-[0.8rem] md:text-[1.2rem] focus:outline-none focus:border-green-400"
          placeholder="Select topic..."
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(topic: Topic) => topic?.title || ""}
          aria-label="Select topic"
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <HiChevronUpDown
            className="h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredTopics.length > 0 && (
          <ComboboxOptions
            className="absolute z-10 mt-1 max-h-60  overflow-auto rounded-md bg-white border border-gray-300 py-1 text-base shadow-lg focus:outline-none sm:text-sm"
            anchor="bottom"
          >
            {filteredTopics.map((topic) => {
              return (
                <ComboboxOption
                  key={topic.id}
                  value={topic}
                  className={`relative text-gray-600 cursor-pointer select-none py-2 pl-10 pr-10 
    data-selected:bg-green-100 data-selected:text-gray-700 group hover:bg-green-50`}
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 group-data-selected:text-green-600 text-green-600">
                    <IoCheckmarkSharp
                      className="h-5 w-5 opacity-0 group-data-selected:opacity-100"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="block truncate text-[1rem] group-data-selected:font-semibold font-normal pl-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-2 align-middle"
                      style={{ backgroundColor: topic.color }}
                    />
                    {topic.title}
                  </span>

                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTopic(topic.id);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-400 cursor-pointer"
                    aria-label={`Delete ${topic.title}`}
                  >
                    <MdOutlineDelete className="w-6 h-6" />
                  </button>
                </ComboboxOption>
              );
            })}
          </ComboboxOptions>
        )}

        {filteredTopics.length === 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white top-1/1 border border-gray-300 py-2 px-3 text-gray-500 text-sm">
            No topics found.
          </div>
        )}
      </div>
    </Combobox>
  );
}
