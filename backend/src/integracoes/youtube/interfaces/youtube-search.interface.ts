export interface YoutubeSearchResponse {
  items?: YoutubeSearchItem[];
}

export interface YoutubeSearchItem {
  id?: {
    videoId?: string;
    channelId?: string;
  };
  snippet?: {
    publishedAt?: string;
    channelId?: string;
    title?: string;
    description?: string;
    channelTitle?: string;
    thumbnails?: YoutubeThumbnails;
  };
}

export interface YoutubeThumbnails {
  default?: YoutubeThumbnail;
  medium?: YoutubeThumbnail;
  high?: YoutubeThumbnail;
  standard?: YoutubeThumbnail;
  maxres?: YoutubeThumbnail;
}

export interface YoutubeThumbnail {
  url?: string;
  width?: number;
  height?: number;
}
