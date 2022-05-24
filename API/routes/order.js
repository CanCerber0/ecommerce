const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

//GET ALL ORDERS

router.get('/', (req, res)=>{
    database.table('orders_details as od')
        .join([
        {
          table:'orders as o',
          on:'o.id = od.order_id'
        },
        {
          table: 'products as p',
          on:'p.id = od.product_id'
        },
        {
          table:'users as u',
          on:'u.id = o.user_id'
        }
        ])
        .withFields(['o.id','p.title as name', 'p.description','p.price', 'u.username'])
        .sort({id:1})
        .getAll()
        .then(orders => {
            if(orders.length > 0){
                res.status(200).json(orders)
            }else{
                res.json({message: 'No tiene compras pendientes'})
            }
        }).catch(err=>console.log(err))
})
//GET ONE ORDER
router.get('/:id', (req, res)=>{
    const orderId = req.params.id;

    database.table('orders_details as od')
        .join([
            {
                table:'orders as o',
                on:'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on:'p.id = od.product_id'
            },
            {
                table:'users as u',
                on:'u.id = o.user_id'
            }
        ])
        .withFields(['o.id','p.title as name', 'p.description','p.price', 'u.username'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if(orders.length > 0){
                res.status(200).json(orders)
            }else{
                res.json({message: 'No tiene compras pendientes'})
            }
        }).catch(err=>console.log(err))
})

/*PLACE A NEW ORDER*/
router.post('/new',(req,res)=>{

    let {userId, products} = req.body;

    if(userId !== null && userId > 0 && !isNaN(userId)){
        database.table('orders')
                .insert({
                    user_id: userId
                })
                .then(newOrderId=>{
                    if(newOrderId.insertId > 0){
                        products.forEach(async(products) => {
                            let data = await database.table('products as p')
                                                    .filter({'p.id': products.id})
                                                    .withFields(['p.quantity'])
                                                    .get();

                            let inCart = products.incart;
                            // Deducir la orden de la base de datos
                            if(data.quantity > 0){
                                data.quantity = data.quantity - inCart;

                                if(data.quantity < 0){
                                    data.quantity = 0
                                }

                            }else{
                                data.quantity = 0
                            }
                        // INSERTAR LOS DETALLES DE LA ORDEN
                        database.table('orders_details')
                                .insert({order_id: newOrderId.insertId, product_id: products.id, quantity: inCart 
                                }).then(newId=>{
                                    database.table('products')
                                            .filter({id: products.id
                                            }).update({quantity: data.quantity
                                            }).then(
                                                successNum =>{}
                                            ).catch(error=>console.log(error))
                                }).catch(error => console.log(error))
                        });
                    } else {
                        res.json({message:'Falla al agregar los detalles de la orden a la nueva orden', success: false})
                    }
                    res.json({
                        message:'Orden realizada con exito',
                        success: true,
                        order_id: newOrderId.insertId,
                        products: products
                    });
                })
                .catch(error=>console.log(error))
    } else {
        res.json({
            message:'Fallo el pedido',
            success: false
        })
    }
});
/*PAYMENT GATEWAY CALL*/
router.post('/payment', (res, req)=>{
    setTimeout(()=>{
        res.status(200).json({success:true})
    }, 2500)
})
module.exports = router;