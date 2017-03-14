DROP TABLE IF EXISTS cart, products, orders, users;



CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(150)
);


CREATE TABLE orders
(
  id SERIAL PRIMARY KEY,
  users_id INTEGER REFERENCES users(id),
  completed BOOLEAN
);


CREATE TABLE products
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  price INTEGER,
  description VARCHAR(150),
  imageurl VARCHAR(150)
);

INSERT INTO products
(Name, price, description, imageurl) VALUES
 ('Ladies Soft Shell Jacket', 70.00, '100% polyester knit shell bonded to a water-resistant film insert and a 100% polyester mesh interior', './products/ladiesSoftShellJacket.png'),
 ('End Human Trafficking Tee - Charcoal', 20.00, '60% combed cotton/40% polyester jersey.', './products/endHumanTraffickingTeeCharcoal.png'),
 ('End Human Trafficking Tee - Navy', 20.00, '60% combed cotton/40% polyester jersey.', './products/endHumanTraffickingTeeNavy.png'),
 ('Bold and Free Muscle Tank Ladies - Black Slub', 25.00, 'Poly viscose 65/35', './products/boldandFreeLadiesBlackSlub.png'),
 ('Bold and Free Muscle Tank Ladies - Black Marble', 25.00, 'Poly viscose 65/35', './products/boldandFreeLadiesBlackMarble.png'),
 ('O.U.R. Full Zip-up Hoodie', 30.00, null, './products/ourFullZipUpHoodie.png'),
 ('O.U.R. Rescue Men’s Soft Shell Jacket', 70.00, '100% polyester knit shell bonded to a water-resistant film insert and a 100% polyester mesh interior', './products/ourRescueMensSoftShellJacket.png'),
 ('Men’s Soft Shell Jacket', 70.00, '93/7 poly/spandex woven shell bonded to 100% polyester microfleece with laminated film insert to repel water and wind 1000MM fabric waterproof.', './products/ourRescueMensJacket.png'),
 ('O.U.R. Rescue Men’s Pullover Jacket', 35.00, '90/10 poly/spandex', './products/ourRescueMensPulloverJacket.png'),
 ('O.U.R. Rescue Ladies Pullover Jacket', 35.00, '90/10 poly/spandex.', './products/ourRescueLadiesPulloverJacket.png'),
 ('O.U.R. Hooded Sweatshirt', 35.00, '80% cotton/ 20% polyester.', './products/ourHoodedSweatshirt.png'),
 ('Freedom for All Tee', 15.00, null, './products/freedomForAllTee.png'),
 ('I’m an Abolitionist Tee', 12.00, '50/50 Cotton-Poly Blend', './products/abolitionistTee.png'),
 ('I’m an Abolitionist Ladies Tee', 12.00, '100% Cotton', './products/abolitionistLadiesTee.png'),
 ('O.U.R. Ladies Tee', 12.00, '100% Cotton', './products/ourLadiesTee.png'),
 ('O.U.R. Long-sleeve Crew Tee', 12.00, '100% combed cotton jersey.', './products/ourLongSleeveCrewTee.png');


CREATE TABLE cart
(
  orders_id INTEGER REFERENCES orders(id),
  products_id INTEGER REFERENCES products(id),
  quantity INTEGER
);

