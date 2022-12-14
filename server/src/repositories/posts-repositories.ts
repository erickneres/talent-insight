export type Attachment = {
  attachmentKey: string,
  attachmentUrl: string,
}

export interface PostsRepository {
  sendPost: (
    userId: string,
    title: string, 
    description: string | null,
    type: string,
    thumbnailKey: string | null,
    thumbnailUrl: string | null,
    
    postAttachments: Attachment[],
    categoriesList: string[]
  ) => Promise<any>;

  getPostById: (postId: string) => Promise<any>;
  getPostAuthor: (postId: string) => Promise<string | undefined>;
  getUserRelatedPosts: (userId: string, id: string) => Promise<any>;
  findPostsByCategories: (categories: string[]) => Promise<any>;
}
