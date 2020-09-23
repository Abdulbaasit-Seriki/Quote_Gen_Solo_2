import { Gender } from '../_Enum/Gender';
import { Role } from '../_Enum/Role';
import { IBaseUser } from '../_Interface/IBaseUser';

export class UserClass implements IBaseUser {
  role: Role = 0;
  username: string;
  gender: Gender;
  knownAs: string;
  constructor(_gender: Gender, _knownAs: string, _username: string) {
    this.gender = _gender;
    this.knownAs = _knownAs;
    this.username = _username;
  }
}
