"use client";

import type { Tweet } from "react-tweet/api";

import {
  VerticalMarqueeClient,
  type TweetItem,
} from "@/registry/components/unlumen/vertical-marquee";

function createAvatarDataUri(seed: string, palette: [string, string, string]) {
  const [bg, skin, shirt] = palette;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stop-color="${bg}" />
          <stop offset=".5" stop-color="${skin}" />
          <stop offset="1" stop-color="${shirt}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill="url(#bg)" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const makeTweet = ({
  id,
  name,
  handle,
  text,
  photo,
  avatarPalette,
}: {
  id: string;
  name: string;
  handle: string;
  text: string;
  photo?: string;
  avatarPalette: [string, string, string];
}): Tweet => ({
  __typename: "Tweet",
  lang: "en",
  created_at: "2026-03-20T10:00:00.000Z",
  display_text_range: [0, text.length],
  entities: {
    hashtags: [],
    urls: [],
    user_mentions: [],
    symbols: [],
  },
  id_str: id,
  text,
  user: {
    id_str: `${id}-user`,
    name,
    profile_image_url_https: createAvatarDataUri(handle, avatarPalette),
    profile_image_shape: "Circle",
    screen_name: handle,
    verified: true,
    is_blue_verified: true,
  },
  edit_control: {
    edit_tweet_ids: [id],
    editable_until_msecs: "0",
    is_edit_eligible: false,
    edits_remaining: "0",
  },
  isEdited: false,
  isStaleEdit: false,
  favorite_count: 0,
  conversation_count: 0,
  news_action_type: "conversation",
  photos: photo
    ? [
        {
          backgroundColor: {
            red: 17,
            green: 24,
            blue: 39,
          },
          cropCandidates: [],
          expandedUrl: photo,
          url: photo,
          width: 1200,
          height: 900,
        },
      ]
    : undefined,
});

const TWEETS: TweetItem[] = [
  {
    id: "demo-1",
    tweet: makeTweet({
      id: "demo-1",
      name: "Elon Musk",
      handle: "elonmusk",
      text: "Mars is basically a fixer-upper.",
      avatarPalette: ["#22d3ee", "#2563eb", "#0f172a"],
    }),
  },
  {
    id: "demo-2",
    tweet: makeTweet({
      id: "demo-2",
      name: "Ryan Reynolds",
      handle: "vancityreynolds",
      text: "I meditate by opening one tab and closing seventeen.",
      avatarPalette: ["#f97316", "#fb7185", "#7f1d1d"],
    }),
  },
  {
    id: "demo-3",
    tweet: makeTweet({
      id: "demo-3",
      name: "Zendaya",
      handle: "zendaya",
      text: "Replying 'on my way' while still choosing socks is a universal experience.",
      avatarPalette: ["#ec4899", "#f59e0b", "#7c2d12"],
    }),
  },
  {
    id: "demo-4",
    tweet: makeTweet({
      id: "demo-4",
      name: "Keanu Reeves",
      handle: "keanureeves",
      text: "The scariest part of adulthood is how often lunch is a decision.",
      avatarPalette: ["#64748b", "#94a3b8", "#0f172a"],
    }),
  },
  {
    id: "demo-5",
    tweet: makeTweet({
      id: "demo-5",
      name: "Taylor Swift",
      handle: "taylorswift13",
      text: "I support any plan that starts with coffee and ends with cancellation.",
      avatarPalette: ["#a78bfa", "#f472b6", "#4338ca"],
    }),
  },
  {
    id: "demo-6",
    tweet: makeTweet({
      id: "demo-6",
      name: "Pedro Pascal",
      handle: "pascalispunk",
      text: "My strongest skill is nodding like I understand the group chat plan.",
      avatarPalette: ["#14b8a6", "#22c55e", "#14532d"],
    }),
  },
  {
    id: "demo-7",
    tweet: makeTweet({
      id: "demo-7",
      name: "Dua Lipa",
      handle: "dualipa",
      text: "The best productivity hack is pretending the deadline is in 14 minutes.",
      avatarPalette: ["#06b6d4", "#3b82f6", "#1e3a8a"],
    }),
  },
  {
    id: "demo-8",
    tweet: makeTweet({
      id: "demo-8",
      name: "Chris Evans",
      handle: "chrisevans",
      text: "I opened the fridge four times like the software update might finally be ready.",
      avatarPalette: ["#ef4444", "#f59e0b", "#7c2d12"],
    }),
  },
  {
    id: "demo-9",
    tweet: makeTweet({
      id: "demo-9",
      name: "Ariana Grande",
      handle: "arianagrande",
      text: "I respect every calendar reminder that starts sounding passive aggressive.",
      avatarPalette: ["#f472b6", "#c084fc", "#6d28d9"],
    }),
  },
  {
    id: "demo-10",
    tweet: makeTweet({
      id: "demo-10",
      name: "LeBron James",
      handle: "kingjames",
      text: "Hydration, discipline, and accidentally liking a message from 2019.",
      avatarPalette: ["#f59e0b", "#f97316", "#7f1d1d"],
    }),
  },
  {
    id: "demo-11",
    tweet: makeTweet({
      id: "demo-11",
      name: "Billie Eilish",
      handle: "billieeilish",
      text: "If I say 'quick call' I am lying to both of us.",
      avatarPalette: ["#84cc16", "#22c55e", "#14532d"],
    }),
  },
  {
    id: "demo-12",
    tweet: makeTweet({
      id: "demo-12",
      name: "Robert Downey Jr.",
      handle: "robertdowneyjr",
      text: "Confidence is just re-opening the same app and hoping this time it behaves.",
      avatarPalette: ["#38bdf8", "#818cf8", "#312e81"],
    }),
  },
];

interface VerticalMarqueeDemoProps {
  speed?: number;
  gap?: number;
  blurSize?: number;
  pauseOnHover?: boolean;
}

export const VerticalMarqueeDemo = ({
  speed = 20,
  gap = 16,
  blurSize = 120,
  pauseOnHover = true,
}: VerticalMarqueeDemoProps) => {
  return (
    <div className="mx-auto h-[760px] w-full max-w-5xl overflow-hidden px-4 py-2">
      <VerticalMarqueeClient
        tweets={TWEETS}
        speed={speed}
        gap={gap}
        blurSize={blurSize}
        pauseOnHover={pauseOnHover}
      />
    </div>
  );
};

export default VerticalMarqueeDemo;
