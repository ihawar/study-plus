import { type FormEvent, useState } from "react";
import supabase from "../utils/supabase";
import { FaGoogle } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";

import { useAlert } from "../context/AlertContext";
import { useLoading } from "../context/LoadingContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const { isLoading, setLoading } = useLoading();
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      showAlert(error.message, "error");
    } else {
      setEmail("");
      setConfirmation(true);
      showAlert("Check your inbox and verify your email.", "success");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setError(error.message);
  };

  return (
    <div className="flex text-center flex-col gap-4 md:gap-8 items-center justify-center bg-gray-100 px-2 py-4  md:px-10 md:py-10 rounded-3xl w-[70vw] md:w-fit">
      {/* Header part */}
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-gray-700 text-2xl md:text-4xl font-extrabold">
          Sign Up or Login
        </h1>
        <p className="text-gray-500 text-[0.8rem] md:text-[1rem]">
          Create an account and you can use
          <span className="text-primary-400"> Study +</span> for free!
        </p>
        {/* errors */}
        {error && <p className="text-red-500">{error}</p>}
        {/* confirm */}
        {confirmation && (
          <div className="bg-green-100 flex items-center gap-2 w-fit text-[0.7rem] md:text-[1.4rem] text-center text-green-800 my-2 p-4 rounded-lg">
            <MdMarkEmailUnread />
            Check your email
          </div>
        )}
        {}
      </div>

      {/* Inputs */}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-4/5">
        <input
          className="border-2 border-primary-300/50 py-2 px-4 bg-white rounded-lg text-gray-600 text-[0.8rem] md:text-[1.2rem] focus:border-green-400 outline-0 focus:text-gray-700"
          type="email"
          placeholder="Email:"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          required
        />
        <button
          className="bg-primary-300 py-3 text-white text-[0.8rem] md:text-[1.2rem] rounded-lg hover:bg-primary-400 duration-100 cursor-pointer disabled:bg-green-200"
          type="submit"
          disabled={isLoading || confirmation}
        >
          {isLoading ? "Sending magic link..." : "Login with Email"}
        </button>
      </form>

      <div className="text-center text-[0.8rem] md:text-[1.2rem] text-gray-500">
        OR
      </div>

      <button
        className="bg-[#4285F4] py-3 w-4/5  text-white text-[0.8rem] md:text-[1.2rem] rounded-lg hover:bg-[#4257f4] duration-100 cursor-pointer flex justify-center items-center gap-4 disabled:bg-blue-200"
        onClick={handleGoogleLogin}
        disabled={isLoading || confirmation}
      >
        <FaGoogle /> Login with Google
      </button>
    </div>
  );
}
