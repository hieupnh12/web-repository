import { Suspense } from "react";
import { Spin } from "antd";

const LazyLoader = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <Spin size="large" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyLoader;
