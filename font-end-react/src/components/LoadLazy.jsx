import { Spin } from "antd";
import { Suspense } from "react";

const LoadLazy = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LoadLazy;