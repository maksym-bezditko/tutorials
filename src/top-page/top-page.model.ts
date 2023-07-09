import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum TopLevelCategory {
  Courses = 'Courses',
  Services = 'Services',
  Products = 'Products',
  Books = 'Books',
}

export class HHData {
  @prop()
  count: number;

  @prop()
  juniorSalary: number;

  @prop()
  middleSalary: number;

  @prop()
  seniorSalary: number;
}

export class TopPageAdvantage {
  @prop()
  title: string;

  @prop()
  description: string;
}

export interface TopPageModel extends Base {}
export class TopPageModel extends TimeStamps {
  @prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @prop()
  secondCategory: string;

  @prop({ unique: true })
  alias: string;

  @prop()
  title: string;

  @prop()
  category: string;

  @prop({ type: () => HHData, _id: false })
  hh?: HHData;

  @prop({ type: () => [TopPageAdvantage], _id: false })
  advantages: TopPageAdvantage[];

  @prop()
  seoText: string;

  @prop({ type: () => [String], _id: false })
  tags: string[];

  @prop()
  tagsTitle: string;
}
