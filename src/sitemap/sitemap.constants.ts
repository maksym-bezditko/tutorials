import { TopLevelCategory } from 'src/top-page/top-page.model';

type RouteMapType = Record<TopLevelCategory, string>;

export const RouteMap: RouteMapType = {
  Courses: 'courses',
  Books: 'books',
  Products: 'products',
  Services: 'services',
};
