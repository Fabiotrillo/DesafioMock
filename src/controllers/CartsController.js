
import { CartService, ProductService } from "../repository/index.js";
import  {ticketsModel}  from "../dao/db/models/tickets.model.js";
import { v4 as uuidv4 } from 'uuid';


class CartsController {
  static getCarts = async (req, res) => {
    try {
      const carts = await CartService.getCarts();
      res.status(200).send({
        status: "success",
        carts: carts,
      });
    } catch (error) {
      console.log("Error al obtener carritos:", error);
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
      console.error("Error:", error.message);
      res.status(404).json({
        status: "error",
        msg: error.message,
      });
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
        console.log("Error al crear el carrito:", error);
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
      console.error("Error al agregar producto al carrito:", error.message);
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
        res.send(error.message)
    }
  }

  static deleteCart = async (req, res) => {
    const cid = req.params.cid;

    if (!cid) {
      return res.status(400).json({ error: "Debe ingresar Id. Cart" });
    }

    try {
      const response = await CartService.removeCart(cid);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error al eliminar carrito:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

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
      console.error("Error al eliminar producto del carrito:", error.message);
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
      console.error("Error al eliminar carrito:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

}

export {CartsController};