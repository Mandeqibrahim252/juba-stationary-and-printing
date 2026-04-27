-- Juba Stationary and Printing Database Setup
-- Run this SQL file in MySQL to create the database

-- Create the database
CREATE DATABASE IF NOT EXISTS juba_stationary;
USE juba_stationary;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    stock INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@jubastationary.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample products
INSERT INTO products (name, price, category, description, stock) VALUES
-- Pens
('Premium Ballpoint Pen', 50, 'pens', 'High-quality ballpoint pen for everyday use', 100),
('Gel Pen Set (10 pcs)', 150, 'pens', 'Set of 10 colorful gel pens', 50),
('Fountain Pen', 500, 'pens', 'Elegant fountain pen for professionals', 20),
('Marker Set (12 pcs)', 200, 'pens', 'Assorted colored markers', 30),
('Highlighters Set (6 pcs)', 180, 'pens', 'Assorted highlighters', 40),

-- Papers
('A4 Paper (500 sheets)', 350, 'papers', 'Premium white A4 printing paper', 200),
('Legal Pad (50 sheets)', 80, 'papers', 'Yellow legal pad', 100),
('Notebook A5', 120, 'papers', 'Hardcover notebook A5 size', 75),
('Spiral Notebook', 100, 'papers', 'Spiral binding notebook', 80),
('Graph Paper (100 sheets)', 100, 'papers', 'Graph paper for drawing', 50),

-- Office Supplies
('Stapler', 250, 'supplies', 'Heavy-duty stapler', 40),
('Paper Clips Box', 50, 'supplies', 'Box of 100 paper clips', 150),
('Scissors (Large)', 150, 'supplies', 'Large scissors', 35),
('Tape Dispenser', 180, 'supplies', 'Tape dispenser with tape', 45),
('Glue Stick', 80, 'supplies', 'White glue stick', 60),
('Ruler 30cm', 60, 'supplies', 'Plastic ruler', 80),
('Eraser Pack (5 pcs)', 40, 'supplies', 'Pack of erasers', 120),
('Hole Puncher', 200, 'supplies', '2-hole puncher', 25),
('File Folder Set', 150, 'supplies', 'Set of 10 file folders', 40),
('Sticky Notes', 80, 'supplies', 'Pack of sticky notes', 90);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Display created tables
SHOW TABLES;

SELECT 'Database setup completed successfully!' AS Message;