-- Schema for Tienda Sneakers Online
-- Run: mysql -u <user> -p < backend/sql/schema.sql

CREATE DATABASE IF NOT EXISTS tienda_sneakers_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_sneakers_test;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Cart
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Orders (simplificado)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Chatbot messages
CREATE TABLE IF NOT EXISTS chatbots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  intent ENUM('product_inquiry','order_status','shipping','return','general') DEFAULT 'general',
  resolved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_chatbots_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  reservation_date DATETIME NOT NULL,
  pickup_date DATETIME NULL,
  status ENUM('pending','confirmed','ready','picked_up','cancelled') DEFAULT 'pending',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservations_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed sample products
INSERT INTO products (name, description, price, image, stock, category) VALUES
  ('Nike Air Max 90', 'Zapatillas clásicas Air Max', 129.99, 'https://example.com/airmax90.jpg', 20, 'running'),
  ('Adidas Ultraboost', 'Ultraboost comodidad premium', 179.99, 'https://example.com/ultraboost.jpg', 15, 'running'),
  ('Puma RS-X', 'Diseño moderno RS-X', 99.99, 'https://example.com/rsx.jpg', 30, 'casual'),
  ('New Balance 574', 'Clásico NB 574', 89.99, 'https://example.com/574.jpg', 25, 'casual');
