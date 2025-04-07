# Readme

# Troubleshoot Access Privalleges on MySQL as Admin

Run Docker Command in Terminal

```docker
  docker exec -it finance_mysql mysql -u root -p
```

Run SQL Query on Terminal

```sql
  SELECT user, host FROM mysql.user;
  SHOW GRANTS FOR 'admin'@'%';
  GRANT ALL PRIVILEGES ON db_financial.* TO 'admin'@'%';
  FLUSH PRIVILEGES;
```

Restart MySQL Container Server

```docker
  docker restart finance_mysql
```

Restart Service Core Api

```docker
  docker restart finance_core_app
```
