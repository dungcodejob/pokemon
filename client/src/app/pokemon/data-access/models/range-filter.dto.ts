export type RangeFilterDto<T = string> = {
  min?: number;
  max?: number;
  exact?: number;
  filterBy: T;
};
