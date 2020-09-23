import { Gender } from '../_Enum/Gender';
import { Role } from '../_Enum/Role';
import { IAddress } from '../_Interface/IAddress';
import { ICertification } from '../_Interface/ICertifications';
import { ITrainer } from '../_Interface/ITrainer';
import { AddressClass } from './AddressClass';
import { CertificationClass } from './CertificationClass';

export class Trainer implements ITrainer {
  focus: string[];
  gender: Gender;
  knownAs: string;
  lastActive: Date;
  address: IAddress;
  certs: ICertification[];
  role: Role = 1;
  username: string;
  profileUrl: string;
  constructor(
    _gender: Gender,
    _knownAs: string,
    _username: string,
    _address: AddressClass,
    _certs: CertificationClass[],
    _focus: string[],
    _profileUrl: string
  ) {
    this.profileUrl = _profileUrl;
    this.gender = _gender;
    this.knownAs = _knownAs;
    this.username = _username;
    this.address = _address;
    this.certs = _certs;
    this.focus = _focus;
    this.lastActive = new Date();
  }
}
