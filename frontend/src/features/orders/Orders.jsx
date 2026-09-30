import { useEffect, useState } from "react";

import {
    getOrders,
    getOrderById
} from "../../services/orderService";

import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails";

import "./Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");

    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [error, setError] = useState("");


    // Load orders
    useEffect(() => {
        fetchOrders();
    }, []);


    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getOrders();

            if (response.data.success) {

                setOrders(
                    response.data.data || []
                );

            } else {

                setOrders([]);
                setError(
                    "Unable to load orders."
                );

            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );

        } finally {

            setLoading(false);

        }
    };


    // View order details
    const handleViewDetails = async (orderId) => {

        try {

            setDetailsLoading(true);
            setError("");

            const response =
                await getOrderById(orderId);

            if (response.data.success) {

                setSelectedOrder(
                    response.data.data
                );

            } else {

                setError(
                    "Unable to load order details."
                );

            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load order details."
            );

        } finally {

            setDetailsLoading(false);

        }
    };


    const closeDetails = () => {
        setSelectedOrder(null);
    };


    // Client-side filters
    const filteredOrders = orders.filter(
        (order) => {

            const orderDate =
                new Date(order.CreatedAt);

            let matchesFromDate = true;
            let matchesToDate = true;
            let matchesStatus = true;


            if (fromDate) {

                const startDate =
                    new Date(
                        `${fromDate}T00:00:00`
                    );

                matchesFromDate =
                    orderDate >= startDate;
            }


            if (toDate) {

                const endDate =
                    new Date(
                        `${toDate}T23:59:59`
                    );

                matchesToDate =
                    orderDate <= endDate;
            }


            if (paymentStatus) {

                matchesStatus =
                    order.PaymentStatus?.toLowerCase() ===
                    paymentStatus.toLowerCase();

            }


            return (
                matchesFromDate &&
                matchesToDate &&
                matchesStatus
            );
        }
    );


    const clearFilters = () => {

        setFromDate("");
        setToDate("");
        setPaymentStatus("");

    };


    return (
        <div className="page-container">

            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>Order History</h1>

                    <p>
                        View previous orders and
                        order details
                    </p>

                </div>

            </div>


            {/* Filters */}

            <OrderFilters
                fromDate={fromDate}
                toDate={toDate}
                paymentStatus={paymentStatus}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onPaymentStatusChange={
                    setPaymentStatus
                }
                onClear={clearFilters}
            />


            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Orders */}

            <div className="table-card">

                <OrderTable
                    orders={filteredOrders}
                    loading={loading}
                    onViewDetails={
                        handleViewDetails
                    }
                />

            </div>


            {/* Details */}

            {selectedOrder && (

                <OrderDetails
                    order={selectedOrder}
                    loading={detailsLoading}
                    onClose={closeDetails}
                />

            )}

        </div>
    );
}

export default Orders;