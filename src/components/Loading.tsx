import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="backdrop-blur-sm z-25 fixed flex bg-white/40 justify-center items-center w-full h-[100vh]">
      <DotLottieReact className="size-20" src="loading.lottie" loop autoplay />
    </div>
  );
}
