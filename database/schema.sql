-- Visitor Management System - Database Schema
-- Version: 1.0.0

-- Create Database
CREATE DATABASE IF NOT EXISTS vms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vms_db;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN','ADMIN','SECURITY') NOT NULL,
    status TINYINT(1) DEFAULT 1,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Visitors Table
CREATE TABLE visitors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visitor_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    id_proof_type VARCHAR(50),
    id_proof_number VARCHAR(100),
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mobile_number (mobile_number),
    INDEX idx_visitor_code (visitor_code),
    INDEX idx_created_at (created_at)
);

-- Visit Purposes Table
CREATE TABLE visit_purposes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- Visits Table
CREATE TABLE visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_number VARCHAR(100) NOT NULL UNIQUE,
    visitor_id BIGINT NOT NULL,
    purpose_id INT NOT NULL,
    person_to_meet VARCHAR(255),
    remarks TEXT,
    qr_token VARCHAR(255),
    check_in_time DATETIME NULL,
    check_out_time DATETIME NULL,
    visit_status ENUM('REGISTERED','CHECKED_IN','CHECKED_OUT','CANCELLED') DEFAULT 'REGISTERED',
    created_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_visits_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id),
    CONSTRAINT fk_visits_purpose FOREIGN KEY (purpose_id) REFERENCES visit_purposes(id),
    CONSTRAINT fk_visits_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_visit_status (visit_status),
    INDEX idx_check_in_time (check_in_time),
    INDEX idx_created_at (created_at)
);

-- Visit Logs Table
CREATE TABLE visit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    remarks TEXT,
    performed_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visit_logs_visit FOREIGN KEY (visit_id) REFERENCES visits(id),
    CONSTRAINT fk_visit_logs_user FOREIGN KEY (performed_by) REFERENCES users(id),
    INDEX idx_visit_id (visit_id),
    INDEX idx_created_at (created_at)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    module VARCHAR(100),
    action VARCHAR(100),
    old_value JSON NULL,
    new_value JSON NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_module (module),
    INDEX idx_created_at (created_at)
);

-- System Settings Table
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_by BIGINT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_system_settings_user FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- User Sessions Table
CREATE TABLE user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_time DATETIME NOT NULL,
    logout_time DATETIME NULL,
    ip_address VARCHAR(100),
    device_info TEXT,
    CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time)
);

-- QR Codes Table
CREATE TABLE qr_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_id BIGINT NOT NULL,
    qr_token VARCHAR(255) NOT NULL,
    qr_image_url TEXT,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    CONSTRAINT fk_qr_codes_visit FOREIGN KEY (visit_id) REFERENCES visits(id),
    INDEX idx_visit_id (visit_id),
    INDEX idx_qr_token (qr_token),
    INDEX idx_expires_at (expires_at)
);

-- Insert Visit Purposes
INSERT INTO visit_purposes (name) VALUES
('Interview'),
('Meeting'),
('Delivery'),
('Maintenance'),
('Vendor Visit'),
('Training'),
('Audit'),
('Other');

-- Insert System Settings
INSERT INTO system_settings (setting_key, setting_value) VALUES
('QR_EXPIRY_HOURS', '24'),
('ALLOW_PHOTO_CAPTURE', 'YES'),
('AUTO_CHECKOUT_HOURS', '12');

-- Create indexes for better performance
ALTER TABLE users ADD INDEX idx_uuid (uuid);
ALTER TABLE visitors ADD INDEX idx_full_name (full_name);
ALTER TABLE visits ADD INDEX idx_visit_number (visit_number);
