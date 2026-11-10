import type { Metadata } from "next";
import { VideoEditingPortfolio } from "@/src/components/portfolio/video-editing-portfolio";

export const metadata: Metadata = {
  title: "Video Editing Portfolio | Kifayatullah Mohammad",
  description:
    "Selected short-form and long-form video editing work by Kifayatullah Mohammad.",
};

export default function VideoEditingPage() {
  return <VideoEditingPortfolio />;
}
