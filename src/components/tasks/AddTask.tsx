import TopicPopover from "../TopicPopover";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { useState } from "react";
import type { Topic } from "@/types/db";
import supabase from "@/utils/supabase";
import Container from "../Container";

export default function AddTask() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState<Array<Topic>>([]);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);

  async function addTask() {
    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .insert([
        {
          title: title.trim(),
          topic_id: selected?.id,
          user_id: user?.id,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      showAlert(`Could not create task: ${error.message}`, "error");
    } else {
      setTitle("");
      setSelected(null);
      showAlert("Task added.", "success");
    }
  }

  return (
    <Container title="Add Task">
      <div className="flex md:flex-row flex-col items-center justify-center gap-4">
        <input
          className="border-2 w-full border-gray-400 py-2 px-4 bg-white rounded-lg text-gray-600 text-[0.8rem] md:text-[1.2rem] focus:border-green-400 outline-0 focus:text-gray-700"
          type="text"
          id="title"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TopicPopover
          topics={topics}
          setTopics={setTopics}
          selected={selected}
          setSelected={setSelected}
        />
        <button
          className="bg-green-500 py-3 px-6 text-white text-[0.8rem] md:text-[1.2rem] rounded-lg hover:bg-green-600 duration-100 cursor-pointer disabled:bg-green-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={!selected || title.trim() === "" || loading}
          onClick={addTask}
        >
          Add
        </button>
      </div>
    </Container>
  );
}
