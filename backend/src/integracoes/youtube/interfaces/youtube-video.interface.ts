import { YoutubeThumbnails } from './youtube-search.interface';

export interface YoutubeVideosResponse {
  items?: YoutubeVideoItem[];
}

export interface YoutubeVideoItem {
  id: string;
  snippet?: {
    publishedAt?: string;
    channelId?: string;
    title?: string;
    description?: string;
    channelTitle?: string;
    thumbnails?: YoutubeThumbnails;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails?: {
    duration?: string;
  };
}
