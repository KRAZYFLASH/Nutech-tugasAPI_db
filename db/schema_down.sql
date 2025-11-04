DROP TRIGGER IF EXISTS update_users_updated_on ON users;
DROP TRIGGER IF EXISTS update_banners_updated_on ON banners;
DROP TRIGGER IF EXISTS update_services_updated_on ON services;

DROP FUNCTION IF EXISTS update_updated_on_column();


DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP INDEX IF EXISTS idx_transactions_created_on;
DROP INDEX IF EXISTS idx_services_service_code;


DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS users CASCADE;

PRINT 'Database schema has been dropped successfully';