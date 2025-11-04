-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(500),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(500) NOT NULL,
    description TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(100) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(500) NOT NULL,
    service_tarif DECIMAL(15, 2) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('TOPUP', 'PAYMENT')),
    description VARCHAR(255),
    total_amount DECIMAL(15, 2) NOT NULL,
    service_code VARCHAR(100),
    service_name VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert banner
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner Diskon', 'https://nutech-integrasi.app/dummy.jpg', 'Letak banner ini sangat strategis'),
('Banner Promosi Spesial', 'https://nutech-integrasi.app/dummy.jpg', 'Banner promosi untuk pengguna baru'),
('Banner Event', 'https://nutech-integrasi.app/dummy.jpg', 'Banner untuk event bulanan'),
('Banner Cashback', 'https://nutech-integrasi.app/dummy.jpg', 'Dapatkan cashback hingga 50%'),
('Banner Reward', 'https://nutech-integrasi.app/dummy.jpg', 'Tukarkan poin dengan reward menarik')
ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO services (service_code, service_name, service_icon, service_tarif) VALUES
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000.00),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000.00),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000.00),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000.00),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000.00),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000.00),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000.00),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000.00)
ON CONFLICT (service_code) DO NOTHING;