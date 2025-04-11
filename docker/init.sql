SELECT user, host FROM mysql.user;
SHOW GRANTS FOR 'admin'@'%';
GRANT ALL PRIVILEGES ON sikeu_unimed.* TO 'admin'@'%';
FLUSH PRIVILEGES;