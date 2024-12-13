const buildConfig = () => {
  const name = process.env.NEXT_PUBLIC_APP_NAME || "Univus";
  const copyright = process.env.NEXT_PUBLIC_COPYRIGHT || "Univus Inc.";
  const defaultTitle =
    process.env.NEXT_DEFAULT_METADATA_TITLE || "Welcome to Univus";
  const defaultDescription = process.env.NEXT_DEFAULT_METADATA_DESCRIPTION || "Welcome to Univus";
  const defaultKeywords = process.env.NEXT_DEFAULT_METADATA_KEYWORDS || "Univus,Univus Inc.";

  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    service: {
      name,
      copyright,
      metadata: {
        title: {
          absolute: defaultTitle,
          default: defaultTitle,
          template: `%s | ${name}`,
        },
        description: defaultDescription,
        keywords: defaultKeywords,
      },
    },
    ogImageSecret:
      process.env.OG_IMAGE_SECRET ||
      "secret_used_for_signing_and_verifying_the_og_image_url"
  };
};

export const config = buildConfig();
