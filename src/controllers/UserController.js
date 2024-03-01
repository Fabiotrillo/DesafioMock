import { UserService } from "../repository/index.js";



class UserController {
  static getUsers = async (req, res) => {
    try {
      const users = await UserService.getUsers();

      res.status(200).json({
        status: "success",
        users: users,
      });
    } catch (error) {
      console.log("Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getUserById = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
    }

    try {
      const result = await UserService.getUserById(userId);
      res.status(200).json({
        status: "success",
        msg: "Usuario encontrado",
        user: result,
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(404).json({
        status: "error",
        msg: error.message,
      });
    }
  };

  static createUser = async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
      const result = await UserService.createUser({
        first_name,
        last_name,
        email,
        password,
        age,
        role
      });
      res.status(201).json({
        status: "success",
        msg: "Usuario creado",
        user: result,
      });
    } catch (error) {
      console.log("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
    }

    const updatedUserData = req.body;

    try {
      const result = await UserService.updateUser(userId, updatedUserData);

      res.status(200).json({
        status: "success",
        msg: `Usuario actualizado con ID: ${userId}`,
        user: result.msg,
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(404).json({
        status: "error",
        msg: error.message,
      });
    }
  };

  static deleteUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Debe ingresar Id. Usuario" });
    }

    try {
      const result = await UserService.deleteUser(userId);

      res.status(200).json({
        status: "success",
        msg: `Usuario eliminado con ID: ${userId}`,
        user: result.msg,
      });
    } catch (error) {
      console.log("Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}

export default UserController;