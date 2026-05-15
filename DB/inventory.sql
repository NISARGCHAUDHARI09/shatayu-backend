-- Inventory Items Table
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    current_stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    max_stock INT DEFAULT 100,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    supplier VARCHAR(255),
    manufacturing_date DATE,
    expiry_date DATE,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'in stock',
    total_value DECIMAL(12,2) GENERATED ALWAYS AS (current_stock * unit_price) STORED
);



