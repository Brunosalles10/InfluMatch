import { YoutubeThumbnails } from './youtube-search.interface';

export interface YoutubeChannelsResponse {
  items?: YoutubeCanalItem[];
}

export interface YoutubeCanalItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    customUrl?: string;
    thumbnails?: YoutubeThumbnails;
  };
  statistics?: {
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
  };
}
