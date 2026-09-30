import CartItem from "./CartItem";

function Cart({
    cart,
    onIncrease,
    onDecrease,
    onRemove
}) {
    return (
        <div className="cart-section">

            <div className="pos-section-header">
                <h2>Cart</h2>

                <span>
                    {cart.length} item{cart.length !== 1 ? "s" : ""}
                </span>
            </div>

            {cart.length === 0 ? (

                <div className="empty-cart">
                    <p>Cart is empty</p>
                    <span>
                        Add products from the list to start billing.
                    </span>
                </div>

            ) : (

                <div className="cart-items">

                    {cart.map((item) => (

                        <CartItem
                            key={item.productId}
                            item={item}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                            onRemove={onRemove}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}

export default Cart;