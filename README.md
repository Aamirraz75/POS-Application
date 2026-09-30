# POS Billing & Inventory Management System

A web-based POS application for managing products, inventory, billing, payments, order history, and sales reports.

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST APIs
- JavaScript
- `mssql`

### Database
- Microsoft SQL Server
- Stored Procedures
- SQL Transactions
- `OPENJSON`

---

## Features

### Product & Inventory
- Add product
- Update product
- Delete product
- View products
- Search products by name or SKU
- Product categories
- Stock quantity management
- Low-stock threshold

### POS & Billing
- Search products
- Add products to cart
- Increase/decrease quantity
- Remove products from cart
- Percentage discount
- Fixed discount
- GST calculation
- Subtotal calculation
- Grand total calculation
- Unique Order ID generation

### Payment
- View pending orders
- Select pending order
- Successful payment
- Failed payment
- Payment webhook
- Webhook secret validation
- Payment amount validation
- Duplicate payment protection
- Transaction ID
- Inventory reduction after successful payment
- Webhook logging

### Order History
- View previous orders
- Filter orders by date
- Filter orders by payment status
- View order details
- View order line items
- View payment status
- View transaction ID

### Reports
- Daily sales report
- Total orders
- Total revenue
- Total discount
- Date filtering
- CSV export

---

## Project Structure

```text
POS-Application/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── products/
│   │   │   ├── pos/
│   │   │   ├── payments/
│   │   │   ├── orders/
│   │   │   └── reports/
│   │   │
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   │
│   └── package.json
│
├── database/
│   ├── 01_create_tables.sql
│   ├── 02_stored_procedures.sql
│   ├── 03_permissions.sql
│   └── 04_seed_data.sql
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Database

The application uses the following tables:

### Categories

Stores product categories.

### Products

Stores product and inventory information.

Main fields:

```text
Id
Name
SKU
CategoryId
Price
StockQuantity
LowStockThreshold
CreatedAt
UpdatedAt
```

### Orders

Stores order and payment information.

Main fields:

```text
Id
OrderId
Subtotal
Discount
Tax
GrandTotal
PaymentStatus
CreatedAt
TransactionId
```

### OrderItems

Stores products associated with each order.

Main fields:

```text
Id
OrderId
ProductId
Quantity
UnitPrice
LineTotal
```

### WebhookLogs

Stores payment webhook information.

Main fields:

```text
Id
OrderId
Status
Amount
TransactionId
CreatedAt
```

---

## Stored Procedures

The application uses stored procedures for important billing and payment operations.

### `sp_CreateOrder`

Used to:

- Create a new order
- Insert order items
- Use a SQL transaction
- Return order information

Cart items are passed as JSON and processed using `OPENJSON`.

### `sp_ProcessPayment`

Used to:

- Validate the order
- Validate payment amount
- Prevent duplicate successful payments
- Check available stock
- Reduce inventory after successful payment
- Update payment status
- Store transaction ID
- Insert webhook log
- Roll back changes if an error occurs

---

## Application Flow

```text
Products
   ↓
POS
   ↓
Cart
   ↓
Create Order
   ↓
Pending Payment
   ↓
Payment Webhook
   ↓
┌─────────────────────┐
│                     │
Success             Failed
│                     │
↓                     ↓
Reduce Stock       No Stock Change
│                     │
↓                     ↓
Paid               Failed
└──────────┬──────────┘
           ↓
      Order History
           ↓
         Reports
```

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get orders |
| GET | `/api/orders/:orderId` | Get order details |

### Payment

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/webhooks/payment` | Process payment webhook |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/daily` | Get daily sales report |
| GET | `/api/reports/export` | Export report as CSV |

---

## Payment Webhook

The payment webhook endpoint is:

```text
POST /api/webhooks/payment
```

The request requires the configured webhook secret.

Header:

```text
x-webhook-secret: <configured-secret>
```

Example request:

```json
{
  "order_id": "ORD-123456",
  "status": "success",
  "amount": 5897.64,
  "transaction_id": "TXN-001"
}
```

Supported payment statuses:

```text
success
failed
```

### Successful Payment

When payment is successful:

- Payment amount is validated.
- Stock availability is checked.
- Product inventory is reduced.
- Order status becomes `Paid`.
- Transaction ID is stored.
- Webhook information is logged.

### Failed Payment

When payment fails:

- Order status becomes `Failed`.
- Transaction ID is stored.
- Webhook information is logged.
- Product inventory is not reduced.

---

## Security

- Database configuration is stored using environment variables.
- `.env` is excluded from Git.
- Payment webhook requests are validated using a configured webhook secret.
- Payment amount is validated against the order Grand Total.
- Duplicate successful payments are prevented.
- SQL transactions are used for order and payment processing.
- Parameterized SQL requests are used by the backend.

---

## Environment Configuration

Create a `.env` file in the `backend` directory.

Example:

```env
PORT=5000

DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
DB_SERVER=localhost
DB_DATABASE=POSDB
DB_PORT=1433

PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

Do not commit the actual `.env` file to GitHub.

---

## Database Setup

Open SQL Server Management Studio and execute the database scripts in this order:

```text
1. database/01_create_tables.sql
2. database/02_stored_procedures.sql
3. database/03_permissions.sql
4. database/04_seed_data.sql
```

These scripts create the database tables, stored procedures, permissions, indexes, and sample data.

---

## Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
```

Configure the `.env` file and start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the React application:

```bash
npm run dev
```

Open the URL shown by Vite in the terminal.

---

## Testing

The following functionality has been tested:

### Products
- Product creation
- Product update
- Product deletion
- Product search
- Category selection
- Stock quantity

### POS
- Product search
- Add to cart
- Quantity increase/decrease
- Remove from cart
- Percentage discount
- Fixed discount
- GST calculation
- Grand total calculation
- Order creation

### Payment
- Successful payment
- Failed payment
- Payment amount validation
- Insufficient stock validation
- Duplicate payment prevention
- Webhook secret validation
- Inventory update after successful payment

### Orders
- Order history
- Date filtering
- Payment status filtering
- Order details
- Order line items

### Reports
- Daily sales report
- Date filtering
- Total orders
- Total revenue
- Total discount
- CSV export

---

## Author

**Sayyed Amir Raza**
