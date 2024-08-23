export interface ApiResponse {
  code: number;
  status: string;
  data: ApiData;
}

export interface ApiData {
  results: any;
}
