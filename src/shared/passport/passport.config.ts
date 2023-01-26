import { IAuthModuleOptions } from '@nestjs/passport';

export const authModuleOptions: IAuthModuleOptions = {
  defaultStrategy: 'jwt',
  session: false,
};
