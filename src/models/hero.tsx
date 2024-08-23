export interface Hero {
  id: number;
  name: string;
  description: string;
  thumbnail: Thumbnail;
}

export interface Thumbnail {
  path: string;
  extension: string;
}
