export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  POKEMON: {
    FIND: '/pokemon',
    FIND_ONE: '/pokemon/findOne',
    FIND_TYPES: '/pokemon/findTypes',
    FIND_FAVORITES: '/pokemon/findFavorites',
    TOGGLE_FAVORITE: (id: string) => `/pokemon/${id}/favorite`,
  },
  CONFIGURATION: '/configuration',
  ASSETS: '/assets',
} as const;
