import { Spin } from "antd";
import { Suspense } from "react";

const LoadLazy = ({ children }) => {
  return (
    <Suspense fallback={<Spin size="large" />}>
      {children} 
    </Suspense>
  );
};

export default LoadLazy;