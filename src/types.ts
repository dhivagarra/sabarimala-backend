export interface TblUser {
  tblid: string;
  userid: string;
  password_hash: string;
  firstname: string;
  lastname: string;
  username: string;
  mobilenumber?: string;
  email?: string;
  role?: string;
  isactive?: string;
  cretedby?: string;
  createddt?: string; // ISO string
  modifiedby?: string;
  modifieddt?: string; // ISO string
}


export interface TblPacklog {
  tblid: number;
  packsno: number;
  transno: string;
  nadacd: string;
  vanchicd: string;
  vanchino?: string;
  bagno: string;
  packdt: string; // ISO string
  packby: string;
  secguard: string;
  receivedt?: string; // ISO string
  receiveby?: string;
  packstatus?: string;
  packcomments?: string;
  isactive?: string;
  cretedby?: string;
  createddt?: string; // ISO string
  modifiedby?: string;
  modifieddt?: string; // ISO string
  modifiedat?: string; // ISO string
}
