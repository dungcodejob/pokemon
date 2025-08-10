import { ObjectValues } from '@shared/utils';

export const SortOrder = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortOrder = ObjectValues<typeof SortOrder>;

export type SortDto<T = string> = {
  sortBy: T;
  order: SortOrder;
};
