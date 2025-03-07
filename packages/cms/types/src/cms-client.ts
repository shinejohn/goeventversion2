export interface ContentItem {
  id: string;
  title: string;
  url: string;
  description: string | undefined;
  content: unknown;
  publishedAt: string;
  image: string | undefined;
  status: ContentItemStatus;
  slug: string;
  categories: Category[];
  tags: Tag[];
  order: number;
  children: ContentItem[];
  parentId: string | undefined;
}

export type ContentItemStatus = 'draft' | 'published' | 'review' | 'pending';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface GetContentItemsOptions {
  collection: string;
  limit?: number;
  offset?: number;
  categories?: string[];
  tags?: string[];
  parentIds?: string[];
  language?: string | undefined;
  sortDirection?: 'asc' | 'desc';
  sortBy?: 'publishedAt' | 'order' | 'title';
  status?: ContentItemStatus;
}

export interface GetCategoriesOptions {
  slugs?: string[];
  limit?: number;
  offset?: number;
}

export interface GetTagsOptions {
  slugs?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Abstract class representing a CMS client.
 */
export abstract class CmsClient {
  /**
   * Retrieves content items based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of content items.
   */
  abstract getContentItems(options?: GetContentItemsOptions): Promise<{
    total: number;
    items: ContentItem[];
  }>;

  /**
   * Retrieves a content item by its ID and type.
   * @returns A promise that resolves to the content item, or undefined if not found.
   */
  abstract getContentItemBySlug(params: {
    slug: string;
    collection: string;
    status?: ContentItemStatus;
  }): Promise<ContentItem | undefined>;

  /**
   * Retrieves categories based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of categories.
   */
  abstract getCategories(options?: GetCategoriesOptions): Promise<Category[]>;

  /**
   * Retrieves a category by its slug.
   * @param slug - The slug of the category.
   * @returns A promise that resolves to the category, or undefined if not found.
   */
  abstract getCategoryBySlug(slug: string): Promise<Category | undefined>;

  /**
   * Retrieves tags based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of tags.
   */
  abstract getTags(options?: GetTagsOptions): Promise<Tag[]>;

  /**
   * Retrieves a tag by its slug.
   * @param slug - The slug of the tag.
   * @returns A promise that resolves to the tag, or undefined if not found.
   */
  abstract getTagBySlug(slug: string): Promise<Tag | undefined>;
}
