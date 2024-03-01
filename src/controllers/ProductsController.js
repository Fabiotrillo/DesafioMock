import { ProductService } from "../repository/index.js";

class ProductController {
    static getProducts = async (req, res) => {
      try {
        const { limit, page, sort, category, availability, query } = req.query;
        const result = await ProductService.getProducts(
          limit,
          page,
          sort,
          category,
          availability,
          query
        );
        const products = result;
        res.status(200).json({
          status: "success",
          products: products,
        });
      } catch (error) {
        console.log("Error en lectura de archivos:", error);
        res.status(400).json({ error: "Error en lectura de archivos" });
      }
    };
  
    static getProductById = async (req, res) => {
      const pid = req.params.pid;
      if (!pid) {
        return res.status(400).json({ error: "Debe ingresar Id. Product" });
      }
  
      try {
        const result = await ProductService.getProductByID(pid);
        res.status(200).json({
          status: "success",
          msg: "Product hallado",
          product: result.msg,
        });
      } catch (error) {
        console.error("Error:", error.message);
        res.status(404).json({
          status: "error",
          msg: error.message,
        });
      }
    };
  
    static createProduct = async (req, res) => {
      const {
        title,
        description,
        price,
        code,
        stock,
        category,
        thumbnail,
      } = req.body;
  
      if (!title || !description || !price || !code || !stock || !category || !thumbnail) {
        return res.status(400).json({ error: "Datos incompletos" });
      }
  
      try {
        const result = await ProductService.createProduct(
          title,
          description,
          price,
          code,
          stock,
          category,
          thumbnail
        );
        res.status(201).json({
          status: "success",
          msg: "Producto creado",
          product: result.msg,
        });
      } catch (error) {
        console.log("Error en lectura de archivos!!");
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };
  
    static updateProduct = async (req, res) => {
      const pid = req.params.pid;
  
      if (!pid) {
        return res.status(400).json({ error: "Debe ingresar Id. Product" });
      }
  
      const updatedProductData = req.body;
  
      try {
        const result = await ProductService.upgradeProduct({
          id: pid,
          ...updatedProductData,
        });
  
        res.status(200).json({
          status: "success",
          msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
          product: result.msg,
        });
      } catch (error) {
        console.error("Error:", error.message);
        res.status(404).json({
          status: "error",
          msg: error.message,
        });
      }
    };
  
    static deleteProduct = async (req, res) => {
      const pid = req.params.pid;
  
      if (!pid) {
        return res.status(400).json({ error: "Debe ingresar Id. Product" });
      }
  
      try {
        const result = await ProductService.deleteProductByID(pid);
  
        res.status(200).json({
          status: "success",
          msg: `Ruta DELETE de PRODUCTS con ID: ${pid}`,
          product: result.msg,
        });
      } catch (error) {
        console.log("Error en lectura de archivos!!");
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };
  }
  
  export  {ProductController};