"use client";

import { VideoAmbient } from "@/registry/components/unlumen/video-ambient";

const VIDEO_SRC =
  "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4";
const VIDEO_POSTER =
  "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217";

export default function VideoAmbientDemo({
  blurAmount = 70,
  intensity = 0.9,
}: {
  blurAmount?: number;
  intensity?: number;
}) {
  return (
    <div className="flex flex-col text-foreground">
      {/* Video */}
      <div className="w-full py-8 px-4">
        <VideoAmbient
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          blurAmount={blurAmount}
          intensity={intensity}
          autoPlay
          muted
          className="max-w-5xl mx-auto"
        />
      </div>

      {/* Content below */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-12">
        {/* Title */}
        <h1 className="mt-2 text-xl font-semibold leading-snug">
          Big Buck Bunny 60fps 4K — Official Blender Foundation Short Film
        </h1>

        {/* Channel row + actions */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              BF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium truncate">
                  The Official Blender Foundations
                </span>
              </div>
              <p className="text-xs text-muted-foreground">1.22M subscribers</p>
            </div>
            <button className="ml-1 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-full hover:bg-foreground/80 transition-colors shrink-0">
              Subscribe
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Like / dislike */}
            <div className="flex rounded-full bg-foreground/10 divide-x divide-border overflow-hidden">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium hover:bg-foreground/20 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                107k
              </button>
              <button className="px-3 py-2 hover:bg-foreground/20 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                </svg>
              </button>
            </div>

            {/* Share */}
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/10 text-sm font-medium hover:bg-foreground/20 transition-colors">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" />
              </svg>
              Share
            </button>

            {/* Save */}
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/10 text-sm font-medium hover:bg-foreground/20 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Save
            </button>

            {/* Clip */}
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/10 text-sm font-medium hover:bg-foreground/20 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                />
              </svg>
              Clip
            </button>

            {/* More */}
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-foreground/8 hover:bg-foreground/12 transition-colors rounded-xl p-4 text-sm cursor-pointer">
          <p className="font-semibold">
            23M views &nbsp;&bull;&nbsp; 11 years ago
          </p>
          <p className="text-muted-foreground mt-1 line-clamp-2">
            UHD High Frame rate version of the iconic short film by Blender, Big
            Buck Bunny. More info:{" "}
            <span className="text-blue-400">
              https://studio.blender.org/projects/b…
            </span>{" "}
            Learn more about this UHD high frame-rate version at:{" "}
            <span className="text-blue-400">
              http://bbb3d.renderfarming.net
            </span>{" "}
            …
          </p>
          <span className="font-semibold text-sm mt-0.5 inline-block">
            Show more
          </span>
        </div>
      </div>
    </div>
  );
}
