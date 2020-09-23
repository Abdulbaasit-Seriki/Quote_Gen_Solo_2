import { Gender } from '../_Enum/Gender';
import { Role } from '../_Enum/Role';

export interface IBaseUser {
  role: Role;
  gender: Gender;
  username: string;
  knownAs: string;
}
