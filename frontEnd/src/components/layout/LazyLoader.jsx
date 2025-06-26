import { Suspense } from "react";
import { Sparkles } from "lucide-react";

const LazyLoader = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="text-center relative z-10">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-800 text-2xl font-bold animate-pulse">
                Đang khởi tạo hệ thống...
              </p>
              <p className="text-gray-600 text-lg">
                Vui lòng chờ trong vài giây
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyLoader;
