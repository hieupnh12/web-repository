import React from "react";
import LoadLazy from "../components/LoadLazy";

const LayoutAdmin = React.lazy(() => import("../layouts/admin/LayoutAdmin"));
const DashBoard = React.lazy(() => import("../pages/admin/dashboard"));
const Customer = React.lazy(() => import("../pages/admin/customer"));
const Product = React.lazy(() => import("../pages/admin/product"));
const Staff = React.lazy(() => import("../pages/admin/staff"));


const PrivateRoutes = [
    
    {
        path: "/admin",
        element: <LoadLazy children={<LayoutAdmin />}/>,
        children: [
            {
                index: true,
                element: <LoadLazy children={<DashBoard />}/>
            },
            {
                path: "customer",
                element: <LoadLazy children={<Customer />}/>
            },
            {
                path: "product",
                element: <LoadLazy children={<Product />}/>
            },
            {
                path: "staff",
                element: <LoadLazy children={<Staff />}/>
            },
        ]
    }
]

export default PrivateRoutes;