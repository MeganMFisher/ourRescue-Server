SELECT users.*, orderid
FROM users
JOIN orders 
ON orders.userid = users.id
WHERE orders.complete = false;