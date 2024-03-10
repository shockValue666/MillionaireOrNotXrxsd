import BiggerOrSmaller from "@/components/globals/bigget-or-smaller";
import Features from "@/components/main/Features";
import Hero from "@/components/main/Hero";
import Image from "next/image";

const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* 1 million!  */}
      <Hero/>
      <Features/>
      <BiggerOrSmaller/>
    </main>
  );
}

export default page;