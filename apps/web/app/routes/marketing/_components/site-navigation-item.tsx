import { NavLink } from 'react-router';

import { NavigationMenuItem } from '@kit/ui/navigation-menu';
import { cn } from '@kit/ui/utils';

const getClassName = (isActive: boolean) => {
  return cn(
    `inline-flex w-max text-sm font-medium transition-colors duration-300`,
    {
      'dark:text-gray-300 dark:hover:text-white': !isActive,
      'text-current dark:text-white': isActive,
    },
  );
};

export function SiteNavigationItem({
  path,
  children,
}: React.PropsWithChildren<{
  path: string;
}>) {
  return (
    <NavigationMenuItem key={path}>
      <NavLink
        className={({ isActive }) => {
          return getClassName(isActive);
        }}
        to={path}
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  );
}
