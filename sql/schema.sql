-- Database schema for Cek Kesehatan
CREATE DATABASE IF NOT EXISTS cek_kesehatan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cek_kesehatan;

-- Current sessions (only latest/current values)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200),
  age INT,
  phone VARCHAR(50),
  height VARCHAR(100),
  sit_and_reach VARCHAR(100),
  heart_rate VARCHAR(100),
  calories VARCHAR(100),
  body_age VARCHAR(100),
  push_up VARCHAR(100),
  leg_back VARCHAR(100),
  handgrip VARCHAR(100),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Historical completed records (for data management & export)
CREATE TABLE IF NOT EXISTS records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(36),
  name VARCHAR(200),
  age INT,
  phone VARCHAR(50),
  height VARCHAR(100),
  sit_and_reach VARCHAR(100),
  heart_rate VARCHAR(100),
  calories VARCHAR(100),
  body_age VARCHAR(100),
  push_up VARCHAR(100),
  leg_back VARCHAR(100),
  handgrip VARCHAR(100),
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
