-- Suppliers Table
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'company',
    type VARCHAR(100),
    contact VARCHAR(100),
    email VARCHAR(100),
    address VARCHAR(255)
);