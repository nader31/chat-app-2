export interface Message {
  _id?: string;
  text: string;
  username: string;
  room: string;
  date?: Date;
  group: string;
  image?: string;
  userImage?:string;
}
