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
{items.map((item, index) => {
  const isLast = index === items.length - 1;
  const baseBg = isLast ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100';
  const borderColor = isLast ? 'border-blue-700' : 'border-blue-200';

  const Container = isLast ? 'div' : Link;
  const containerProps = isLast
    ? {}
    : { to: item.href || '#' };

  return (
    <React.Fragment key={index}>
      <Container
        {...containerProps}
        className={`relative inline-block font-medium text-sm ${baseBg} transition-colors px-4 py-1 border-y ${borderColor} shadow-sm hover:shadow-md`}
        style={{
          clipPath: 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)',
          marginRight: '-15px', // Overlap items
        }}
      >
        <span>{item.label}</span>
      </Container>
    </React.Fragment>
  );
})}




    </nav>
  );
};

export default Breadcrumb;
