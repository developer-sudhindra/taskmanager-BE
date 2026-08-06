import { MenuType } from '../users/menu-type.enum';

export interface IMenuItem {
  name: string;
  path: string;
  icon: string;
}

const dashboard = { name: 'Dashboard', path: '/', icon: '' };

const projects = { name: 'Projects', path: '/projects', icon: '' };

const calendar = { name: 'Calendar', path: '/calendar', icon: '' };

export const menuList: Record<MenuType, IMenuItem[]> = {
  [MenuType.user]: [projects, calendar],
  [MenuType.standard]: [dashboard, projects, calendar],
  [MenuType.admin]: [dashboard, projects, calendar],
  [MenuType.premium]: [dashboard, projects, calendar],
};
