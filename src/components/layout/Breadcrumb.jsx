import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {/* Home link */}
      <a href="/dashboard" className="flex items-center hover:text-blue-600 transition-colors">
        <Home className="w-4 h-4" />
      </a>

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
            // Clickable items
            <>
              <a 
                href={item.href || '#'} 
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;