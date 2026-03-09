export type GaleriSortBy = "latest" | "oldest" | "title_asc" | "title_desc";
export type GaleriOrientation = "all" | "portrait" | "landscape" | "square";
export type GaleriDepartment =
  | "all"
  | "teknik_elektro"
  | "teknik_informatika"
  | "sistem_informasi"
  | "teknik_komputer"
  | "teknik_biomedik"
  | "teknologi_informasi";

export interface GaleriItem {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  takenAt: string;
}

export interface GaleriPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GaleriListResponse {
  items: GaleriItem[];
  pagination: GaleriPagination;
}

export interface GaleriDetailResponse {
  item: GaleriItem;
}

export interface GaleriListParams {
  page: number;
  limit: number;
  sortBy?: GaleriSortBy;
  department?: GaleriDepartment;
}

export interface UpsertGaleriPayload {
  title: string;
  link: string;
  takenAt: string;
  imageUrl?: string;
}
