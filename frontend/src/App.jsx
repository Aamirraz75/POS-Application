import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Products from "./features/products/Products";
import POS from "./features/pos/POS";
import Payment from "./features/payments/Payment";
import Orders from "./features/orders/Orders";
import Reports from "./features/reports/Reports";

function App() {
    return (
        <BrowserRouter>

            <nav className="app-nav">

                <div className="nav-brand">
                    POS Application
                </div>

                <div className="nav-links">

                    <Link to="/products">
                        Products
                    </Link>

                    <Link to="/pos">
                        POS
                    </Link>
           
                    <Link to="/payment">
                        Payment
                    </Link>
         
                    <Link to="/orders">
                        Orders
                    </Link>

                    <Link to="/reports">
                        Reports
                    </Link>

                </div>

            </nav>

            <Routes>

                <Route
                    path="/"
                    element={<Products />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/pos"
                    element={<POS />}
                />

                <Route
                    path="/payment"
                    element={<Payment />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;