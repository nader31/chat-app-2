export interface Group {
  _id: string;
  id: string;
  name: string;
  users: {
    userId:string,
    role:string
  }[];
  rooms: {
    name:string
  }[];
}

export type GroupInfo = Omit<Group, 'users' | 'rooms' | '_id'>

export type GroupFetched = Omit<Group, 'id'>
