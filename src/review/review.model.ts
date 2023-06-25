import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface ReviewModel extends Base {}
export class ReviewModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  title: string;

  @prop()
  description: string;

  @prop()
  rating: number;

  @prop({ type: () => Types.ObjectId })
  productId: Types.ObjectId;
}
