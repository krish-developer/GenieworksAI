export interface TextResponse {
  prompt: string;
  response?: string;
}
export interface ImageResponse {
  prompt: string;
  images?: string[];
}
export interface MediaResponse {
  prompt: string;
  media?: string;
}
