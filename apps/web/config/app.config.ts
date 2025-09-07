import { z } from 'zod';

const production = process.env.NODE_ENV === 'production';

const AppConfigSchema = z
  .object({
    name: z
      .string({
        description: `This is the name of your SaaS. Ex. "Makerkit"`,
      })
      .min(1),
    title: z
      .string({
        description: `This is the default title tag of your SaaS.`,
      })
      .min(1),
    description: z.string({
      description: `This is the default description of your SaaS.`,
    }),
    url: z
      .string()
      .url({
        message: `Please provide a valid HTTPS URL for VITE_SITE_URL`,
      }),
    locale: z.string().default('en'),
    theme: z.enum(['light', 'dark', 'system']).default('light'),
    production: z.boolean(),
    themeColor: z.string().default('#ffffff'),
    themeColorDark: z.string().default('#0a0a0a'),
  })
  .refine(
    (schema) => {
      const isCI = import.meta.env.VITE_CI;

      if (isCI ?? !schema.production) {
        return true;
      }

      return !schema.url.startsWith('http:');
    },
    {
      message: `Please use a valid HTTPS URL in production.`,
      path: ['url'],
    },
  )
  .refine(
    (schema) => {
      return schema.themeColor !== schema.themeColorDark;
    },
    {
      message: `Please provide different theme colors for light and dark themes.`,
      path: ['themeColor'],
    },
  );

const appConfig = AppConfigSchema.parse({
  name: import.meta.env.VITE_PRODUCT_NAME || 'GoEventCity',
  title: import.meta.env.VITE_SITE_TITLE || 'GoEventCity - Discover Amazing Events in Your City',
  description: import.meta.env.VITE_SITE_DESCRIPTION || 'GoEventCity helps you discover the best events, venues, and entertainment in your city.',
  url: import.meta.env.VITE_SITE_URL || 'https://goeventcity.com',
  locale: import.meta.env.VITE_DEFAULT_LOCALE || 'en',
  theme: import.meta.env.VITE_DEFAULT_THEME_MODE || 'light',
  themeColor: import.meta.env.VITE_THEME_COLOR || '#ffffff',
  themeColorDark: import.meta.env.VITE_THEME_COLOR_DARK || '#0a0a0a',
  production,
});

export default appConfig;
