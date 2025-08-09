export type ObjectValues<T> = T[keyof T];

export const SortOrder = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortOrder = ObjectValues<typeof SortOrder>;
