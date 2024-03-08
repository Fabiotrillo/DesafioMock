import { ProductService } from "../repository/index.js";
import { productErrorDictionary, customizeError } from "../utils/errors.js";

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
      req.logger.info("Obteniendo productos con éxito");
      res.status(200).json({
        status: "success",
        products: products,
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_PRODUCTS', error.message, productErrorDictionary);
      req.logger.error(`Error en lectura de archivos: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getProductById = async (req, res) => {
    const pid = req.params.pid;
    if (!pid) {
      return res.status(400).json({ error: "Debe ingresar Id. Product" });
    }

    try {
      const result = await ProductService.getProductByID(pid);
      req.logger.info("Producto encontrado con éxito");
      res.status(200).json({
        status: "success",
        msg: "Product hallado",
        product: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('FETCHING_PRODUCTS', error.message, productErrorDictionary);
      req.logger.error(`Error en lectura de archivos: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
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
      req.logger.info("Producto creado con éxito");
      res.status(201).json({
        status: "success",
        msg: "Producto creado",
        product: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('CREATE_PRODUCT', error.message, productErrorDictionary);
      req.logger.error(`Error en lectura de archivos: ${formattedError}`);
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

      req.logger.info("Producto actualizado con éxito");
      res.status(200).json({
        status: "success",
        msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
        product: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('UPDATE_PRODUCT', error.message, productErrorDictionary);
      req.logger.error(`Error al actualizar archivo: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static deleteProduct = async (req, res) => {
    const pid = req.params.pid;

    if (!pid) {
      return res.status(400).json({ error: "Debe ingresar Id. Product" });
    }

    try {
      const result = await ProductService.deleteProductByID(pid);

      req.logger.info("Producto eliminado con éxito");
      res.status(200).json({
        status: "success",
        msg: `Ruta DELETE de PRODUCTS con ID: ${pid}`,
        product: result.msg,
      });
    } catch (error) {
      const formattedError = customizeError('UPDATE_PRODUCT', error.message, productErrorDictionary);
      req.logger.error(`Error al actualizar archivo: ${formattedError}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}

export { ProductController };