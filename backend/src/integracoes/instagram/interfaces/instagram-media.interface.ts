export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
export type InstagramMediaProductType = 'FEED' | 'REELS' | 'STORY' | 'AD';

export interface InstagramMidiaItem {
  id: string;
  caption?: string;
  media_type?: InstagramMediaType;
  media_product_type?: InstagramMediaProductType;
  permalink?: string;
  media_url?: string;
  thumbnail_url?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
  username?: string;
}

export interface InstagramMidiasResponse {
  data?: InstagramMidiaItem[];
}
