function BillingSummary({
    subtotal,
    discountType,
    discountValue,
    onDiscountTypeChange,
    onDiscountValueChange,
    discount,
    taxPercent,
    onTaxPercentChange,
    tax,
    grandTotal,
    onCreateOrder,
    disabled,
    message
}) {

    const handleDiscountChange = (e) => {

        const value = Number(e.target.value);

        if (Number.isNaN(value)) {
            onDiscountValueChange(0);
            return;
        }

        if (value < 0) {
            onDiscountValueChange(0);
            return;
        }

        if (
            discountType === "percentage" &&
            value > 100
        ) {
            onDiscountValueChange(100);
            return;
        }

        if (
            discountType === "fixed" &&
            value > subtotal
        ) {
            onDiscountValueChange(subtotal);
            return;
        }

        onDiscountValueChange(value);
    };

    const handleDiscountTypeChange = (e) => {

        onDiscountTypeChange(e.target.value);

        // Reset discount when changing type
        onDiscountValueChange(0);
    };

    const handleTaxChange = (e) => {

        const value = Number(e.target.value);

        if (Number.isNaN(value)) {
            onTaxPercentChange(0);
            return;
        }

        if (value < 0) {
            onTaxPercentChange(0);
            return;
        }

        if (value > 100) {
            onTaxPercentChange(100);
            return;
        }

        onTaxPercentChange(value);
    };

    return (

        <div className="billing-summary">

            <h2>Billing Summary</h2>

            {/* Subtotal */}

            <div className="summary-row">

                <span>
                    Subtotal
                </span>

                <strong>
                    ₹{Number(subtotal).toFixed(2)}
                </strong>

            </div>

            {/* Discount Type */}

            <div className="billing-field">

                <label>
                    Discount Type
                </label>

                <select
                    value={discountType}
                    onChange={handleDiscountTypeChange}
                >
                    <option value="percentage">
                        Percentage
                    </option>

                    <option value="fixed">
                        Fixed Amount
                    </option>
                </select>

            </div>

            {/* Discount Input */}

            <div className="billing-field">

                <label>
                    {discountType === "percentage"
                        ? "Discount (%)"
                        : "Discount Amount"}
                </label>

                <input
                    type="number"
                    min="0"
                    max={
                        discountType === "percentage"
                            ? 100
                            : subtotal
                    }
                    step="0.01"
                    value={discountValue}
                    onChange={handleDiscountChange}
                />

            </div>

            {/* Discount Amount */}

            <div className="summary-row">

                <span>
                    Discount
                </span>

                <strong>
                    - ₹{Number(discount).toFixed(2)}
                </strong>

            </div>

            {/* GST Input */}

            <div className="billing-field">

                <label>
                    GST (%)
                </label>

                <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={taxPercent}
                    onChange={handleTaxChange}
                />

            </div>

            {/* GST Amount */}

            <div className="summary-row">

                <span>
                    GST ({Number(taxPercent)}%)
                </span>

                <strong>
                    ₹{Number(tax).toFixed(2)}
                </strong>

            </div>

            {/* Grand Total */}

            <div className="grand-total-row">

                <span>
                    Grand Total
                </span>

                <strong>
                    ₹{Number(grandTotal).toFixed(2)}
                </strong>

            </div>

            {/* Create Order */}

            <button
                className="create-order-button"
                onClick={onCreateOrder}
                disabled={disabled}
            >
                Create Order
            </button>

            {message && (

                <div className="pos-message">
                    {message}
                </div>

            )}

        </div>
    );
}

export default BillingSummary;