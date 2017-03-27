DROP TABLE IF EXISTS abolitionists, address, productTypes, products, cart;
--DROP TABLE products CASCADE; <-- we need this to deal with key constraints. 

CREATE TABLE abolitionists (
  id SERIAL PRIMARY KEY,
  image VARCHAR(150)
);

CREATE TABLE address (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(150),
  lastName VARCHAR(150),
  emailAddress VARCHAR(150),
  address VARCHAR(150),
  city VARCHAR(150),
  zipcode VARCHAR(150)
);

INSERT INTO abolitionists 
(image) VALUES
('./abolitionists/abolitionists.png'),
('./abolitionists/abolitionists1.png'),
('./abolitionists/abolitionists2.png'),
('./abolitionists/abolitionists3.png'),
('./abolitionists/abolitionists4.png'),
('./abolitionists/abolitionists5.png'),
('./abolitionists/abolitionists6.png'),
('./abolitionists/abolitionists7.png'),
('./abolitionists/abolitionists8.png'),
('./abolitionists/abolitionists9.png'),
('./abolitionists/abolitionists10.png'),
('./abolitionists/abolitionists11.png'),
('./abolitionists/abolitionists12.png'),
('./abolitionists/abolitionists13.png'),
('./abolitionists/abolitionists14.png'),
('./abolitionists/abolitionists15.png'),
('./abolitionists/abolitionists16.png'),
('./abolitionists/abolitionists17.png');


--  CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(255),
--     last_name VARCHAR(255),
--     username VARCHAR(255),
--     password VARCHAR(255)
-- );


-- CREATE TABLE orders
-- (
--   id SERIAL PRIMARY KEY,
--   userid INTEGER REFERENCES users(id),
--   completed BOOLEAN
-- );

CREATE TABLE productTypes
(
  id SERIAL PRIMARY KEY,
  type VARCHAR(50)
);

INSERT INTO productTypes
(type) VALUES
('Jacket'),
('Hoodie'),
('T-shirt');

CREATE TABLE products
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  price INTEGER,
  description VARCHAR(150),
  imageurl VARCHAR(150),
  size VARCHAR(50),
  quantity INTEGER,
  productType INTEGER REFERENCES productTypes(id)
);

INSERT INTO products
(Name, price, description, imageurl, productType) VALUES
 ('Ladies Soft Shell Jacket', 70.00, '100% polyester knit shell bonded to a water-resistant film insert and a 100% polyester mesh interior', './products/ladiesSoftShellJacket.png', 1),
 ('End Human Trafficking Tee - Charcoal', 20.00, '60% combed cotton/40% polyester jersey.', './products/endHumanTraffickingTeeCharcoal.png', 3),
 ('End Human Trafficking Tee - Navy', 20.00, '60% combed cotton/40% polyester jersey.', './products/endHumanTraffickingTeeNavy.png', 3),
 ('Bold and Free Muscle Tank Ladies - Black Slub', 25.00, 'Poly viscose 65/35', './products/boldandFreeLadiesBlackSlub.png', 3),
 ('Bold and Free Muscle Tank Ladies - Black Marble', 25.00, 'Poly viscose 65/35', './products/boldandFreeLadiesBlackMarble.png', 3),
 ('O.U.R. Full Zip-up Hoodie', 30.00, null, './products/ourFullZipUpHoodie.png', 2),
 ('O.U.R. Rescue Men’s Soft Shell Jacket', 70.00, '100% polyester knit shell bonded to a water-resistant film insert and a 100% polyester mesh interior', './products/ourRescueMensSoftShellJacket.png', 1),
 ('Men’s Soft Shell Jacket', 70.00, '93/7 poly/spandex woven shell bonded to 100% polyester microfleece with laminated film insert to repel water and wind 1000MM fabric waterproof.', './products/ourRescueMensJacket.png', 1),
 ('O.U.R. Rescue Men’s Pullover Jacket', 35.00, '90/10 poly/spandex', './products/ourRescueMensPulloverJacket.png', 1),
 ('O.U.R. Rescue Ladies Pullover Jacket', 35.00, '90/10 poly/spandex.', './products/ourRescueLadiesPulloverJacket.png', 1),
 ('O.U.R. Hooded Sweatshirt', 35.00, '80% cotton/ 20% polyester.', './products/ourHoodedSweatshirt.png', 2),
 ('Freedom for All Tee', 15.00, null, './products/freedomForAllTee.png', 3),
 ('I’m an Abolitionist Tee', 12.00, '50/50 Cotton-Poly Blend', './products/abolitionistTee.png', 3),
 ('I’m an Abolitionist Ladies Tee', 12.00, '100% Cotton', './products/abolitionistLadiesTee.png', 3),
 ('O.U.R. Ladies Tee', 12.00, '100% Cotton', './products/ourLadiesTee.png', 3),
 ('O.U.R. Long-sleeve Crew Tee', 12.00, '100% combed cotton jersey.', './products/ourLongSleeveCrewTee.png', 3);


-- CREATE TABLE cart
-- (
--   id SERIAL PRIMARY KEY,
--   -- orderid INTEGER REFERENCES orders(id),
--   productid INTEGER REFERENCES products(id),
--   size VARCHAR(50),
--   quantity INTEGER
-- );



