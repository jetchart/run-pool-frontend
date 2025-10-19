import { UserDto } from './user.dto';

export class UserCredentialDto extends UserDto {
  accessToken: string;

  constructor(user: UserDto, accessToken: string) {
    super(
      user.userId,
      user.email,
      user.name,
      user.givenName,
      user.familyName,
      user.pictureUrl,
      user.administrator
    );
    this.accessToken = accessToken;
  }
}
