type AuthUserDto = {
  id: string;
  name: string;
};

export type AuthResultDto = {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
};
