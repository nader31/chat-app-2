export interface Group {
  _id?: string;
  id: string;
  name: string;
  users?: {
    _id:string,
    userId:string,
    role:string
  }[];
  rooms?: {
    _id:string,
    name:string
  }[];
}
