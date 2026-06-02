import React from "react";
import { Calendar } from "lucide-react";
import doctorImg from "@/assets/doctor-illustration.png";
import { Float } from "@/components/common/Float";

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="banner-gradient relative overflow-hidden rounded-2xl p-6 text-primary-foreground md:p-8">
      <div className="relative z-10 max-w-md">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 py-1 text-xs">
          <Calendar className="h-3 w-3" />
          {dateStr} {timeStr}
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">Good Day, {name}!</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">Have a Nice Day!</p>
      </div>

      {/* Floating doctor illustration — gentle up/down motion */}
      <Float
        speed="slow"
        className="absolute -right-4 -top-2 hidden md:block"
      >
        <img
          src={doctorImg}
          alt="Doctor"
          className="h-48 w-auto object-contain opacity-90 drop-shadow-lg"
          width={192}
          height={192}
        />
      </Float>

      {/* Decorative circles — slower, subtler drift, layered with the figure */}
      <Float
        speed="slower"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10"
      />
      <Float
        speed="slower"
        className="absolute -bottom-8 right-20 h-24 w-24 rounded-full bg-primary-foreground/5"
      />
    </div>
  );
};

export default WelcomeBanner;
