import React, { lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutCommon from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LazyLoader from "./components/layout/LazyLoader";
import Permissions from "./pages/Permission";
import AuthGuard from "./utils/AuthGuard";

import StatisticsLayout from "./pages/Statistics/StatisticLayout";
import Overview from "./pages/Statistics/pages/statistic/Overview";
import Inventory from "./pages/Statistics/pages/statistic/Inventory";
import Supplier from "./pages/Statistics/pages/statistic/Supplier";
import Customer from "./pages/Statistics/pages/statistic/Customer";
import RevenueLayout from "./pages/Statistics/RevenueTabs"; // dùng làm layout
import RevenueByYears from "./pages/Statistics/pages/statistic/RevenueByYears";
import RevenueByMonths from "./pages/Statistics/pages/statistic/RevenueByMonth";
import RevenueByDays from "./pages/Statistics/pages/statistic/RevenueByDay";
import RevenueDatetoDate from "./pages/Statistics/pages/statistic/RevenueByDatetoDate";

// Các page (dùng lazy load)
const Dashboard = lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./pages/Dashboard/Dashboard")), 600)
    )
);
const ExportStock = lazy(() => import("./pages/Stock/ExportStock"));
const Export = lazy(() => import("./pages/Stock/components/Export"));
const Import = lazy(() => import("./pages/Stock/components/Import"));
const Login = lazy(() => import("./pages/Login/Login"));
const ForgotPassword = lazy(() => import("./pages/Login/ForgotPassword"));
const ProductsPage = lazy(() => import("./pages/Products"));
const WarehouseAreas = lazy(() => import("./pages/Storages"));
const Customers = lazy(() => import("./pages/Customers"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Staff = lazy(() => import("./pages/Staffs/Staff"));
const Account = lazy(() => import("./pages/Accounts/Account"));
const InventoryPage = lazy(() => import("./pages/Inventory"));
const AttributesPage = lazy(() => import("./pages/Attributes"));


// cho Inventory
const InventoryListPage = lazy(() => import("./pages/Inventory/InventoryListPage"));
const InventoryCreatePage = lazy(() => import("./pages/Inventory/InventoryCreatePage"));
const InventoryDetailsPage = lazy(() => import("./pages/Inventory/InventoryDetailsPage"));
const IMEIScanPage = lazy(() => import("./pages/Inventory/IMEIScanPage"));
const InventorySummaryPage = lazy(() => import("./pages/Inventory/InventorySummaryPage"));

const ImportStock = lazy(() => import("./pages/Stock/ImportStock"));
// const Products = lazy(() => import('./pages/Products/Products'));
// const Inventory = lazy(() => import('./pages/Inventory/Inventory'));

// Optional: 404 Not Found page
const NotFound = () => (
  <div className="p-10 text-center text-xl">404 - Không tìm thấy trang</div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route
          index
          element={
            <LazyLoader>
              <Login />
            </LazyLoader>
          }
        />
        <Route
          path="forgot-password"
          element={
            <LazyLoader>
              <ForgotPassword />
            </LazyLoader>
          }
        />
      </Route>

      <Route element={<AuthGuard />}>
        {/* Route cho Manager */}
        <Route path="manager" element={<LayoutCommon />}>
          <Route
            index
            element={
              <LazyLoader>
                <Dashboard />
              </LazyLoader>
            }
          />
          <Route
            path="dashboard"
            element={
              <LazyLoader>
                <Dashboard />
              </LazyLoader>
            }
          />

          <Route
            path="export"
            element={
              <LazyLoader>
                <ExportStock />
              </LazyLoader>
            }
          />
          <Route
            path="export/addexport"
            element={
              <LazyLoader>
                <Export />
              </LazyLoader>
            }
          />

          <Route
            path="products"
            element={
              <LazyLoader>
                <ProductsPage />
              </LazyLoader>
            }
          />

          <Route path="inventory">
            <Route
              index
              element={
                <LazyLoader>
                  <InventoryListPage />
                </LazyLoader>
              }
            />
            <Route
              path="create"
              element={
                <LazyLoader>
                  <InventoryCreatePage />
                </LazyLoader>
              }
            />
            <Route
              path="details/:inventoryId"
              element={
                <LazyLoader>
                  <InventoryDetailsPage />
                </LazyLoader>
              }
            />
            <Route
              path="scan/:inventoryId"
              element={
                <LazyLoader>
                  <IMEIScanPage />
                </LazyLoader>
              }
            />
            <Route
              path="summary/:inventoryId"
              element={
                <LazyLoader>
                  <InventorySummaryPage />
                </LazyLoader>
              }
            />
          </Route>
          <Route
            path="storage"
            element={
              <LazyLoader>
                <WarehouseAreas />
              </LazyLoader>
            }
          />
          <Route
            path="suppliers"
            element={
              <LazyLoader>
                <Suppliers />
              </LazyLoader>
            }
          />
          <Route
            path="staff"
            element={
              <LazyLoader>
                <Staff />
              </LazyLoader>
            }
          />
          <Route
            path="account"
            element={
              <LazyLoader>
                <Account />
              </LazyLoader>
            }
          />
          <Route
            path="permissions"
            element={
              <LazyLoader>
                <Permissions />
              </LazyLoader>
            }
          />
          <Route
            path="Customers"
            element={
              <LazyLoader>
                <Customers />
              </LazyLoader>
            }
          />
          <Route path="import">
            <Route
              index
              element={
                <LazyLoader>
                  <ImportStock />
                </LazyLoader>
              }
            />
            <Route
              path="addimport"
              element={
                <LazyLoader>
                  <Import />
                </LazyLoader>
              }
            />
          </Route>

          <Route
            path="attributes"
            element={
              <LazyLoader>
                <AttributesPage />
              </LazyLoader>
            }
          />

          <Route path="statistics" element={<StatisticsLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="suppliers" element={<Supplier />} />
            <Route path="customers" element={<Customer />} />

            {/* Route doanh thu tab */}
            <Route path="revenue" element={<RevenueLayout />}>
              <Route index element={<Navigate to="year" replace />} />
              <Route path="year" element={<RevenueByYears />} />
              <Route path="month" element={<RevenueByMonths />} />
              <Route path="day" element={<RevenueByDays />} />
              <Route path="datetodate" element={<RevenueDatetoDate />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Route cho Staff */}
        <Route path="staff" element={<LayoutCommon />}>
          <Route
            index
            element={
              <LazyLoader>
                <Dashboard />
              </LazyLoader>
            }
          />
          <Route
            path="dashboard"
            element={
              <LazyLoader>
                <Dashboard />
              </LazyLoader>
            }
          />

          <Route
            path="export"
            element={
              <LazyLoader>
                <ExportStock />
              </LazyLoader>
            }
          />
          <Route
            path="export/addexport"
            element={
              <LazyLoader>
                <Export />
              </LazyLoader>
            }
          />

          <Route
            path="products"
            element={
              <LazyLoader>
                <ProductsPage />
              </LazyLoader>
            }
          />

          <Route path="inventory">
            <Route
              index
              element={
                <LazyLoader>
                  <InventoryListPage />
                </LazyLoader>
              }
            />
            <Route
              path="create"
              element={
                <LazyLoader>
                  <InventoryCreatePage />
                </LazyLoader>
              }
            />
            <Route
              path="details/:inventoryId"
              element={
                <LazyLoader>
                  <InventoryDetailsPage />
                </LazyLoader>
              }
            />
            <Route
              path="scan/:inventoryId"
              element={
                <LazyLoader>
                  <IMEIScanPage />
                </LazyLoader>
              }
            />
            <Route
              path="summary/:inventoryId"
              element={
                <LazyLoader>
                  <InventorySummaryPage />
                </LazyLoader>
              }
            />
          </Route>
          <Route
            path="storage"
            element={
              <LazyLoader>
                <WarehouseAreas />
              </LazyLoader>
            }
          />
          <Route
            path="suppliers"
            element={
              <LazyLoader>
                <Suppliers />
              </LazyLoader>
            }
          />
          <Route
            path="staff"
            element={
              <LazyLoader>
                <Staff />
              </LazyLoader>
            }
          />
          <Route
            path="account"
            element={
              <LazyLoader>
                <Account />
              </LazyLoader>
            }
          />
          <Route
            path="permissions"
            element={
              <LazyLoader>
                <Permissions />
              </LazyLoader>
            }
          />
          <Route
            path="Customers"
            element={
              <LazyLoader>
                <Customers />
              </LazyLoader>
            }
          />
          <Route path="import">
            <Route
              index
              element={
                <LazyLoader>
                  <ImportStock />
                </LazyLoader>
              }
            />
            <Route
              path="addimport"
              element={
                <LazyLoader>
                  <Import />
                </LazyLoader>
              }
            />
          </Route>

          <Route
            path="attributes"
            element={
              <LazyLoader>
                <AttributesPage />
              </LazyLoader>
            }
          />

          <Route path="statistics" element={<StatisticsLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="suppliers" element={<Supplier />} />
            <Route path="customers" element={<Customer />} />

            {/* Route doanh thu tab */}
            <Route path="revenue" element={<RevenueLayout />}>
              <Route index element={<Navigate to="year" replace />} />
              <Route path="year" element={<RevenueByYears />} />
              <Route path="month" element={<RevenueByMonths />} />
              <Route path="day" element={<RevenueByDays />} />
              <Route path="datetodate" element={<RevenueDatetoDate />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </>
  ),
  {
    future: {
      v7_startTransition: true,
    },
  }
);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </QueryClientProvider>
    </>
  );
}

export default App;