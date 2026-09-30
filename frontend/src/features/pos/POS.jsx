import { useEffect, useState } from "react";

import { getProducts } from "../../services/productService";
import { createOrder as createOrderApi } from "../../services/orderService";

import ProductList from "./ProductList";
import Cart from "./Cart";
import BillingSummary from "./BillingSummary";

import "./POS.css";

function POS() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);

    const [discountType, setDiscountType] =
        useState("percentage");

    const [discountValue, setDiscountValue] =
        useState(0);

    const [taxPercent, setTaxPercent] =
        useState(18);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    // Load products
    const loadProducts = async () => {

        try {

            const response = await getProducts();

            setProducts(
                Array.isArray(response.data.data)
                    ? response.data.data
                    : []
            );

        } catch (error) {

            console.error(error);

            setMessage("Failed to load products");
        }
    };

    // Add product to cart
    const addToCart = (product) => {

        setCart((previousCart) => {

            const existingProduct =
                previousCart.find(
                    item => item.productId === product.Id
                );

            if (existingProduct) {

                return previousCart.map(item =>
                    item.productId === product.Id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...previousCart,
                {
                    productId: product.Id,
                    name: product.Name,
                    unitPrice: Number(product.Price),
                    quantity: 1
                }
            ];
        });

        setMessage("");
    };

    // Increase quantity
    const increaseQuantity = (productId) => {

        setCart((previousCart) =>
            previousCart.map(item =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (productId) => {

        setCart((previousCart) =>
            previousCart
                .map(item =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    // Remove item
    const removeFromCart = (productId) => {

        setCart((previousCart) =>
            previousCart.filter(
                item => item.productId !== productId
            )
        );
    };

    // ============================
    // BILLING CALCULATIONS
    // ============================

    // Subtotal
    const subtotal = cart.reduce(
        (total, item) => {
            return total +
                Number(item.unitPrice) *
                Number(item.quantity);
        },
        0
    );

    // Discount value entered by user
    const discountInput =
        Number(discountValue) || 0;

    // Calculate discount
    let discount = 0;

    if (discountType === "percentage") {

        discount =
            (subtotal * discountInput) / 100;

    } else {

        discount =
            discountInput;
    }

    // Never allow discount above subtotal
    discount = Math.min(
        Math.max(discount, 0),
        subtotal
    );

    // Amount after discount
    const amountAfterDiscount =
        subtotal - discount;

    // GST
    const gstPercent =
        Number(taxPercent) || 0;

    const tax =
        (amountAfterDiscount * gstPercent) / 100;

    // Grand Total
    const grandTotal =
        amountAfterDiscount + tax;

    // ============================
    // CREATE ORDER
    // ============================

    const createOrder = async () => {

        try {

            if (cart.length === 0) {

                setMessage(
                    "Please add at least one product"
                );

                return;
            }

            const orderData = {

                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),

                discountType,

                discountValue:
                    Number(discountValue) || 0,

                taxPercent:
                    Number(taxPercent) || 0
            };

            console.log("Order Data:", orderData);

            const response =
                await createOrderApi(orderData);

            console.log(
                "Order Response:",
                response.data
            );

            setMessage(
                `Order created successfully: ${response.data.data.OrderId}`
            );

            setCart([]);

            setDiscountValue(0);

            setTaxPercent(18);

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to create order"
            );
        }
    };

    return (

        <div className="pos-page">

            <div className="pos-header">

                <div>

                    <h1>POS Billing</h1>

                    <p>
                        Create orders and process billing
                    </p>

                </div>

            </div>

            <div className="pos-layout">

                {/* Products */}

                <ProductList
                    products={products}
                    search={search}
                    onSearchChange={setSearch}
                    onAddToCart={addToCart}
                />

                {/* Cart + Billing */}

                <div className="pos-right">

                    <Cart
                        cart={cart}
                        onIncrease={increaseQuantity}
                        onDecrease={decreaseQuantity}
                        onRemove={removeFromCart}
                    />

                    <BillingSummary
                        subtotal={subtotal}

                        discountType={discountType}
                        discountValue={discountValue}

                        onDiscountTypeChange={
                            setDiscountType
                        }

                        onDiscountValueChange={
                            setDiscountValue
                        }

                        discount={discount}

                        taxPercent={taxPercent}

                        onTaxPercentChange={
                            setTaxPercent
                        }

                        tax={tax}

                        grandTotal={grandTotal}

                        onCreateOrder={
                            createOrder
                        }

                        disabled={
                            cart.length === 0
                        }

                        message={message}
                    />

                </div>

            </div>

        </div>
    );
}

export default POS;