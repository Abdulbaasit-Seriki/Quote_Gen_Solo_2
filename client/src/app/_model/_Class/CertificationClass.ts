import { ICertification } from '../_Interface/ICertifications';

export class CertificationClass implements ICertification {
  Description: string;
  Title: string;
  Created: Date;
  Expired: Date;
  constructor(_des: string, _title: string, _created: Date, _expire: Date) {
    this.Description = _des;
    this.Created = _created;
    this.Expired = _expire;
    this.Title = _title;
  }
}
