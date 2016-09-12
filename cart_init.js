var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1/cart');
require('./models/cart_model.js');
var Address = mongoose.model('Address');
var Billing = mongoose.model('Billing');
var Product = mongoose.model('Product');
var ProductQuantity = mongoose.model('ProductQuantity');
var Order = mongoose.model('Order');
var Customer = mongoose.model('Customer');

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB :' + db + ' disconnected');
});

var gracefulExit = function () {
  var mongoose = require('mongoose');
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB :' + db + ' is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

function addProduct(customer, order, name, imagefile,
                    price, description, instock){
  var product = new Product({name:name, imagefile:imagefile,
                             price:price, description:description,
                             instock:instock});
  product.save(function(err, results){

    if (err) {
      console.log("Error: " + err);
      return;
    }else
      console.log("res:"+results);

    order.items.push(new ProductQuantity({quantity: 1,
                                          product: [product]}));
    order.save();
    customer.save();
    console.log("Product " + name + " Saved.");

  });
}

Product.remove().exec(function(){
  Order.remove().exec(function(){
    Customer.remove().exec(function(){
      var shipping = new Address({
        name: 'Customer A',
        address: 'Somewhere',
        city: 'My Town',
        state: 'CA',
        zip: '55555'
      });
      var billing = new Billing({
        cardtype: 'Visa',
        name: 'Customer A',
        number: '1234567890',
        expiremonth: 1,
        expireyear: 2020,
        address: shipping
      });
      var customer = new Customer({
        userid: 'CustomerA',
        shipping: shipping,
        billing: billing,
        cart: []
      });
      customer.save(function(err, result){

        if (err) {
          console.log("Customer Save Error: " + err);
          return;
        }else{
          console.log("Customer res:"+result);
        }

        var order = new Order({
          userid: customer.userid,
          items: [],
          shipping: customer.shipping,
          billing: customer.billing
        });
        order.save(function(err, result){

          if (err) {
            console.log("Order Save Error: " + err);
            return;
          }else{
            console.log("order res:"+result);
          }

          addProduct(customer, order, 'Gold plated Necklace',
            'necklace.jpg', 12.34,
            'Ladies Gold Plated Necklace with Sapphire.',
            Math.floor((Math.random()*10)+1));
          addProduct(customer, order, 'Pearl Set',
            'pearl-set.jpg', 45.45,
            'Ladies pearl jewellery set.',
            Math.floor((Math.random()*10)+1));
          addProduct(customer, order, 'Crystal Earing',
            'earing.jpg', 38.52,
            'Silver and Crystal earing.',
            Math.floor((Math.random()*10)+1));
          addProduct(customer, order, 'Crystal Ring',
            'ring.jpg', 77.45,
            'Crystal Finger ring (Gents & Ladies).',
            Math.floor((Math.random()*10)+1));
          addProduct(customer, order, 'Flower Ring',
            'flower-ring.jpg', 97.50,
            'Flower ring with Australian Ruby.',
            Math.floor((Math.random()*10)+1));

          //mongoose.connection.close();
        });
      });
    });
  });
});;

