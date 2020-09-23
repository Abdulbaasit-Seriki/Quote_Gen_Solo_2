import { IAddress } from './IAddress';
import { IBaseUser } from './IBaseUser';
import { ICertification } from './ICertifications';

export interface ITrainer extends IBaseUser {
  focus: string[]; // ex. Bodybuilding, weight loss and etc.
  lastActive: Date;
  address: IAddress;
  profileUrl: string;
  certs: ICertification[];
}
