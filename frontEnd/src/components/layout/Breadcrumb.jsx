import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/manager') ? '/manager' : '/staff';

  return (
    <nav className="flex items-center text-sm text-gray-600 space-x-1 p-2 border-gray-300 border-b" aria-label="breadcrumb">
      {/* Home link */}
      <Link
        to={`${basePath}/dashboard`}
        className="hover:underline text-blue-600 flex items-center"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>

      {/* Render chevron and breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-400" />

            {isLast ? (
              <span
                className="text-gray-800"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href || '#'}
                className="hover:underline text-blue-600"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
