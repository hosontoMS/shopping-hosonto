/**
 * Created by Ziaur on 2/08/2016.
 */

'use strict'

var async = require('async');

var myConnection;

var orderModule = function(myConn){myConnection = myConn;};

orderModule.addToCart = function(params, cback) {
        var productId = "";
        //var myConnection = this.myConn;


        myConnection.connect();

        // initially save the new parameters into metadata
        myConnection.saveAutoParams(params, function callback(){

            // load the save params from this session as well as any earlier sessions
            myConnection.loadAutoParams(params, function c2(){
                console.log("product=" + params['product'] + "customer=" + params['customer___']);

                var customer = (params['customer___'])[0];
                console.log("cust=" + customer + " cart=" + JSON.stringify(customer.cart));
                //customer.cart['product']=params['product']._id;

                var found = false;
                for(var i=0; i<customer.cart.length; i++){
                    var item = customer.cart[i];
                    var product = item.product[0];
                    var paramProd = (params['product']);
                    //console.log("item id=" + product+ " prod id=" + paramProd);

                    if (product['_id'] == paramProd['_id']){
                        item.quantity += 1;
                        found = true;
                    }
                }
                if (!found){
                    customer.cart.push({quantity: 1,
                        product: [(params['product'])]});
                }

                console.log("cart==" + JSON.stringify(customer.cart));


                params['customer___']= ([customer]);

                myConnection.saveAutoParams(params, cback);
            });
        });


}



orderModule.checkOut = function(params, cback) {

    myConnection.connect();

    // initially save the new parameters into metadata
    myConnection.saveAutoParams(params, function c2(){
        myConnection.loadAutoParams(params, cback);
    });

}


orderModule.placeOrder = function(params, callback){

    var mongoose = require('mongoose'),
        Customer = mongoose.model('customer'),
        Order = mongoose.model('orders');

    myConnection.connect();

    // initially save the new parameters into metadata
    myConnection.saveAutoTable(params, function c2(){


        var customer = params['customer___'][0];

        var orderItems = customer.cart;
        var orderShipping = customer.shipping;
        var orderBilling = customer.billing;


        var newOrder = new Order({userid: 'customerA',
            items: orderItems, shipping: orderShipping,
            billing: orderBilling});

        newOrder.save(function(err, results){
            if(err){
                params['__Error'] = "Failed to save Order.";
                myConnection.loadAutoTable(params, callback);
            } else {
                Customer.update({ userid: 'CustomerA' },
                    {$set:{cart:[]}})
                    .exec(function(err, results){
                        if (err || results < 1){
                            params['__Error'] = "Failed to update cart.";
                        } else {
                            params['__Status'] = "Order Successfully Saved.";
                        }
                        myConnection.loadAutoTable(params, callback);
                    });
            }
        });

    });
}

//module.exports = exports = business_logic;
module.exports = orderModule;