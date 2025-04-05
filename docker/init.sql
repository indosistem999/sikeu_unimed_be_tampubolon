SELECT user, host FROM mysql.user;

SHOW GRANTS FOR 'admin'@'%';


GRANT ALL PRIVILEGES ON db_financial.* TO 'admin'@'%';

FLUSH PRIVILEGES;

-- GRANT ALL PRIVILEGES ON db_financial.* TO 'admin'@'%' IDENTIFIED BY 'password';

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS db_financial;
