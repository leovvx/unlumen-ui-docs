export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ui.unlumen.com/#website",
      url: "https://ui.unlumen.com",
      name: "Unlumen UI",
      description:
        "Fully animated, open-source component distribution built with React, TypeScript, Tailwind CSS, Motion and Shadcn CLI. Browse a list of components you can install, modify, and use in your projects.",
      inLanguage: "en",
      publisher: {
        "@id": "https://ui.unlumen.com/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://ui.unlumen.com/#organization",
      name: "Unlumen UI",
      url: "https://ui.unlumen.com",
      logo: {
        "@type": "ImageObject",
        url: "https://ui.unlumen.com/icon-logo.png",
        width: 512,
        height: 512,
      },
      sameAs: ["https://twitter.com/unlumenui", "https://github.com/leovvx"],
    },
    {
      "@type": "SoftwareApplication",
      name: "Unlumen UI",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier available; Pro plan one-time purchase",
      },
      url: "https://ui.unlumen.com",
      description:
        "Animated React component registry built with TypeScript, Tailwind CSS, and Motion.",
    },
  ],
};
