import Container from "./Container";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { colorOptions, type ColorOption } from "../constants/colors";
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

export default function CreateTopic() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState(colorOptions[0]);
  const [loading, setLoading] = useState(false);

  async function handleCreateTopic() {
    console.log("1");
    if (!title.trim()) return;
    console.log("2");

    setLoading(true);
    const { error } = await supabase
      .from("topics")
      .insert([
        {
          title: title.trim(),
          color: selected.hex,
          user_id: user?.id,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      showAlert(`Could not create topic: ${error.message}`, "error");
    } else {
      setTitle("");
      showAlert("Topic created.", "success");
    }
  }
  return (
    <Container title="Create Topic">
      <div className="flex flex-col justify-center items-start gap-4">
        <div className="flex w-full flex-col gap-2 items-start">
          <label
            className="text-gray-700 font-semibold text-[0.8rem] md:text-[1.2rem]"
            htmlFor="title"
          >
            Title:
          </label>
          <input
            className="border-2 w-full border-gray-400 py-2 px-4 bg-white rounded-lg text-gray-600 text-[0.8rem] md:text-[1.2rem] focus:border-green-400 outline-0 focus:text-gray-700"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Math, Physics, CS ...."
          />
        </div>

        <div className="flex w-full  flex-col gap-2 items-start">
          <label
            className="text-gray-700 font-semibold text-[0.8rem] md:text-[1.2rem]"
            htmlFor="color"
          >
            Color:
          </label>
          <ColorDropdown selected={selected} setSelected={setSelected} />
        </div>

        <button
          className="bg-green-500 py-3 px-6 text-white text-[0.8rem] md:text-[1.2rem] rounded-lg hover:bg-green-600 duration-100 cursor-pointer disabled:bg-green-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={!title || loading}
          onClick={handleCreateTopic}
        >
          Create
        </button>
      </div>
    </Container>
  );
}

type ColorDropDownProps = {
  selected: ColorOption;
  setSelected: (color: ColorOption) => void;
};

function ColorDropdown({ selected, setSelected }: ColorDropDownProps) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative w-full">
        <ListboxButton
          id="color"
          className="flex items-center justify-between border-2 w-full border-gray-400 py-2 px-4 bg-white rounded-lg text-gray-600 text-[0.8rem] md:text-[1.2rem] focus:border-green-400 focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: selected.hex }}
            />
            {selected.name}
          </span>
        </ListboxButton>

        <ListboxOptions
          className="absolute mt-1 w-full bg-white rounded-lg border-0 shadow-lg z-10 max-h-60 overflow-auto"
          style={{ top: "100%" }}
        >
          {colorOptions.map((color) => (
            <ListboxOption
              key={color.name}
              value={color}
              className={`cursor-pointer text-gray-600 px-4 bg-[${color.hex}] py-2 hover:bg-gray-100 data-[focus]:bg-green-100 `}
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
