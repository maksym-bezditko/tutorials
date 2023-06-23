import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthModel extends Base {}
export class AuthModel extends TimeStamps {
  @prop({ unique: true })
  login: string;

  @prop()
  password: string;
}
