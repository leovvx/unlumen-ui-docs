export interface ShowcaseProject {
  name: string;
  url: string;
  image?: {
    /** Public path or allowed remote URL for the project preview image. */
    src: string;
    alt?: string;
  };
  /** One-liner describing what the project is. */
  description: string;
  /** How the project uses Unlumen UI. */
  usage?: string;
  author?: string;
  authorUrl?: string;
}

export const showcaseProjects: ShowcaseProject[] = [
  // Add curated projects here after reviewing submissions.
  // {
  //   name: "Example Project",
  //   url: "https://example.com",
  //   image: {
  //     src: "/showcase/example-project.png",
  //     alt: "Example Project homepage",
  //   },
  //   description: "A beautiful landing page built with Unlumen UI.",
  //   usage: "Uses the animated button and background grid components.",
  //   author: "Jane Doe",
  // },

  {
    name: "æski",
    url: "https://aeski.vercel.app/",
    description:
      "A free, open-source app to generate ASCII animations of any object. Outputs React components or Videos/GIFs.",
    usage:
      "Customized several Unlumen UI components and used others out of the box to create a cyber-brutalist design, retaining the great interaction features of the UI kit.",
    image: {
      src: "/showcase/aeski.png",
      alt: "æski homepage",
    },
    author: "Andrea Micheli",
    authorUrl: "https://andreamicheli.vercel.app",
  },
  {
    name: "Pépite Boisson",
    url: "https://www.pepiteboisson.ch/",
    description:
      "A Swiss coffee alternative made with Lion’s Mane, cacao, carob, and roasted barley. Crafted for a smooth coffee-chocolate taste without caffeine or added sugar.",
    usage:
      "Used Unlumen UI to build a playful editorial e-commerce experience with smooth interactions, bold typography, animated sections, and a warm modern identity around the product.",
    image: {
      src: "/showcase/pepite-boisson.png",
      alt: "Pépite Boisson homepage",
    },
    author: "Aline & David",
    authorUrl: "https://www.pepiteboisson.ch/a-propos",
  },
  {
    name: "Unlumen",
    url: "https://unlumen.com/",
    description:
      "A Swiss design and development studio building modern websites, apps, and digital experiences with a strong focus on performance, clarity, and visual identity.",
    usage:
      "Unlumen UI powers the entire experience through reusable animated components, refined interactions, smooth transitions, and a cohesive system designed to scale across templates and custom projects.",
    image: {
      src: "/showcase/unlumen.png",
      alt: "Unlumen homepage",
    },
    author: "Léo",
    authorUrl: "https://unlumen.com/about",
  },

  {
    name: "Le Juste Milieu",
    url: "https://www.le-juste-milieu.ch/",
    description:
      "A Swiss hypnosis and therapeutic support practice helping people navigate anxiety, medical procedures, pain, and emotional balance through a calm and human-centered approach.",
    usage:
      "Built with Unlumen UI to create a soft editorial experience focused on clarity, typography, emotional comfort, and subtle motion throughout the website.",
    image: {
      src: "/showcase/le-juste-milieu.png",
      alt: "Le Juste Milieu homepage",
    },
    author: "Christelle Roduit",
    authorUrl: "https://www.le-juste-milieu.ch/",
  },
  {
    name: "Théâtre Cottens",
    url: "https://www.theatrecottens.com/",
    description:
      "An independent theater space blending contemporary performances, cultural events, and local artistic expression in a warm and intimate atmosphere.",
    usage:
      "Used Unlumen UI to craft an immersive cultural website with refined typography, cinematic layouts, smooth transitions, and an editorial-inspired visual identity.",
    image: {
      src: "/showcase/theatre-cottens.png",
      alt: "Théâtre Cottens homepage",
    },
    author: "Théâtre Cottens",
    authorUrl: "https://www.theatrecottens.com/",
  },
];
