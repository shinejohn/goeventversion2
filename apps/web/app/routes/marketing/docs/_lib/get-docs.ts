import { createCmsClient } from '@kit/cms';
import { getLogger } from '@kit/shared/logger';

export const getDocs = async (language: string | undefined) => {
  const cms = await createCmsClient();
  const logger = await getLogger();

  try {
    const data = await cms.getContentItems({
      collection: 'documentation',
      language,
      limit: 500,
      content: false,
    });

    return data.items;
  } catch (error) {
    logger.error({ error }, 'Failed to load documentation pages');

    return [];
  }
};
