import { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { useModal } from "../context/ModalContext";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";

export default function Profile() {
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { hideModal } = useModal();
  const { showAlert } = useAlert();
  const { profile, user, logout, refetchProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editProfile = async () => {
    // validate the name
    if (!name.trim()) {
      showAlert("Name cannot be empty.", "error");
      return;
    }
    // validate the file
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;

      if (!fileType.startsWith("image/")) {
        showAlert("Only image files are allowed.", "error");
        return;
      }

      if (fileSize > 5 * 1024 * 1024) {
        showAlert("File must be smaller than 5MB.", "error");
        return;
      }
    }

    // Upload file
    setLoading(true);
    let profilePhotoUrl = profile?.profile_photo_url || null;
    if (selectedFile) {
      console.log("Upload started");
      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${user?.id}/profile.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, selectedFile, {
          upsert: true,
        });
      console.log("upload finished.");
      if (uploadError) {
        console.error("Upload error:", uploadError);
        showAlert("Failed to upload image.", "error");
        setLoading(false);
        return;
      }

      profilePhotoUrl = filePath; // just store the file path
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name,
          profile_photo_url: profilePhotoUrl,
        })
        .eq("id", user?.id);
      if (updateError) {
        console.error("Update error:", updateError);
        showAlert("Failed to update profile.", "error");
        setLoading(false);
        return;
      }
    } else {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name,
        })
        .eq("id", user?.id);
      if (updateError) {
        console.error("Update error:", updateError);
        showAlert("Failed to update profile.", "error");
        setLoading(false);
        return;
      }
    }
    showAlert("Profile updated.", "success");
    await refetchProfile();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLoading(false);
  };

  useEffect(() => {
    setName(profile?.name || "");
  }, [profile]);

  return (
    <div className="relative flex flex-col gap-8">
      {/* close button */}
      <IoIosClose
        onClick={() => {
          hideModal();
        }}
        className="absolute top-2 right-2 size-12 text-gray-500 rounded-2xl duration-100 ease-in-out hover:bg-red-100 cursor-pointer"
      />
      {/* profile part */}
      <div className="flex gap-4 items-center">
        <div
          className={`bg-green-200  bg-cover size-20 rounded-full`}
          style={{
            backgroundImage: `url(${
              profile?.profile_photo_url || "/profile.svg"
            })`,
          }}
        ></div>

        <div>
          <p className="text-gray-700 font-medium text-xl md:text-2xl">
            {profile?.name || "User"}
          </p>
          <p className="text-gray-600 text-[0.8rem] md:text-[1rem]">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>
      {/* loading */}
      {isLoading && <p className="text-blue-400"> Updating your profile...</p>}
      {/* edit profile */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2 items-start">
          <label
            className="text-gray-700 text-[0.8rem] md:text-[1.2rem]"
            htmlFor="name"
          >
            Change name:
          </label>
          <input
            className="border-2 border-gray-400 py-2 px-4 bg-white rounded-lg text-gray-600 text-[0.8rem] md:text-[1.2rem] focus:border-green-400 outline-0 focus:text-gray-700"
            type="text"
            name="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </div>

        <div className="flex flex-col gap-2 items-start">
          <label
            className="text-gray-700 text-[0.8rem] md:text-[1.2rem]"
            htmlFor="profile"
          >
            Change profile:{" "}
          </label>
          <input
            ref={fileInputRef}
            accept="image/*"
            name="profile"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFile(file || null);
            }}
            disabled={isLoading}
            className="file:bg-green-300 file:mr-4 file:px-4 file:text-[0.8rem] md:file:text-[1.2rem] file:py-2 hover:file:bg-green-400 active:file:bg-green-400 duration-100 file:rounded-lg file:text-white cursor-pointer"
          />
        </div>
        {/* Buttons */}
        <div className="space-x-4">
          <button
            className="bg-blue-500 py-3 px-6 text-white text-[0.8rem] md:text-[1.2rem] rounded-lg hover:bg-blue-600 duration-100 cursor-pointer disabled:bg-blue-200 disabled:cursor-not-allowed"
            type="submit"
            disabled={(name === profile?.name && !selectedFile) || isLoading}
            onClick={editProfile}
          >
            Save
          </button>
          <button
            className="bg-red-500 py-3 px-6 text-white text-[0.8rem] md:text-[1.2rem] rounded-lg hover:bg-red-600 duration-100 cursor-pointer disabled:bg-red-200 disabled:cursor-not-allowed"
            type="submit"
            onClick={() => {
              logout();
              showAlert("Logged out successfully.", "info");
              hideModal();
            }}
            disabled={isLoading}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
