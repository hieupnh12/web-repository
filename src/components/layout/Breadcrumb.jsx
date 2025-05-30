import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/manager') ? '/manager' : '/staff';

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {/* Home link */}
      <Link
        to={`${basePath}/dashboard`}
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.length > 0 && (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === items.length - 1 ? (
            // Last item - not clickable
            <span className="text-gray-800 font-medium">{item.label}</span>
          ) : (
            <>
              <Link
                to={item.href || '#'}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
