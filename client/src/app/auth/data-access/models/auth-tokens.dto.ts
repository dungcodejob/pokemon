type AuthUserDto = {
  id: string;
  name: string;
};

export type AuthTokensDto = {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
};
