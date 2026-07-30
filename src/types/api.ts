export interface ApiSuccess<T> {
  success: true;
  data: T;
  request_id?: string;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
  };
  request_id?: string;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface ApiPage<T> {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}
