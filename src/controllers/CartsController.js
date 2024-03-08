
import { CartService, ProductService } from "../repository/index.js";
import  {ticketsModel}  from "../dao/db/models/tickets.model.js";
import { v4 as uuidv4 } from 'uuid';
import { cartErrorDictionary, customizeError } from "../utils/errors.js";


class CartsController {
  static getCarts = async (req, res) => {
    try {
      const carts = await CartService.getCarts();
      res.status(200).send({
        status: "success",
        carts: carts,
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_CARTS', error.message, cartErrorDictionary);
    console.error("Error interno del servidor:", formattedError);
    res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getCartByID = async (req, res) => {
    const cid = req.params.cid;
    if (!cid) {
      return res.status(400).json({ error: "Debe ingresar Id. Cart" });
    }

    try {
      const cart = await CartService.getCartByID(cid);
      res.status(200).json({
        status: "success",
        msg: "Cart encontrado",
        cart: cart,
      });
    } catch (error) {
      const formattedError = customizeError('CART_NOT_FOUND_BY_ID', error.message, cartErrorDictionary);
    console.error(formattedError);
    res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static createCarts = async (req, res) => {
    try {
        
        const cart = await CartService.createCarts({});
        res.status(201).json({
            status: "success",
            msg: "Carrito creado",
            cart: cart,
        });
    } catch (error) {
      const formattedError = customizeError('CREATE_CART', error.message, cartErrorDictionary);
      console.error(formattedError);
      res.status(500).json({ error: "Error interno del servidor" });
    }
};
  static addProductToCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid; 
  
    if (!cid || !pid) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
  
    try {
      const result = await CartService.addProductToCart(cid, pid);
      res.status(200).json({
        status: result.status,
        msg: result
      });
    } catch (error) {
      const formattedError = customizeError('ADD_PRODUCT_TO_CART', error.message, cartErrorDictionary);
      console.error(formattedError);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };



  static finalizePurchase =  async (req,res) => {
    try {

        const cartId = req.params.cid;
        const cart = await CartService.getCartByID(cartId);
        if(cart){
            if(!cart.products.length){
                return res.send("es necesario que agrege productos antes de realizar la compra")
            }
            const ticketProducts = [];
            const rejectedProducts = [];
            for(let i=0; i<cart.products.length;i++){
                const cartProduct = cart.products[i];
                const productDB = await ProductService.getProductByID(cartProduct.product._id);
                if(!productDB){
                  return res.status(404).json({
                    message:'No se encontro el producto'
                  })
                  
                }
                //comparar la cantidad de ese producto en el carrito con el stock del producto
                if(cartProduct.quantity<=productDB.stock){
                    ticketProducts.push(cartProduct);
                } else {
                    rejectedProducts.push(cartProduct);
                }
            }
        
            const newTicket = {
                code:uuidv4(),
                purchase_datetime: new Date(),
                amount:500,
                purchaser:'email@email.com'
            }
            
            const ticketCreated = await ticketsModel.create(newTicket);
            res.send(ticketCreated)
        } else {
            res.send("el carrito no existe")
        }
    } catch (error) {
      const formattedError = customizeError('FINALIZE_PURCHASE', error.message, cartErrorDictionary);
      console.error(formattedError);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }



  static removeProductFromCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    if (!cid || !pid) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
      const response = await CartService.removeProductFromCart(cid, pid);
      res.status(200).json(response);
    } catch (error) {
      const formattedError = customizeError('REMOVE_PRODUCT_FROM_CART', cartErrorDictionary);
      console.error(formattedError);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static removeCart = async (req, res) => {
    const cid = req.params.cid;

    if (!cid) {
      return res.status(400).json({ error: "Debe ingresar Id. Cart" });
    }

    try {
      const response = await CartService.removeCart(cid);
      res.status(200).json(response);
    } catch (error) {
      const formattedError = customizeError('DELETE_CART', error.message, cartErrorDictionary);
      console.error(formattedError);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

}

export {CartsController};