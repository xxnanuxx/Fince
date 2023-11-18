import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../Utils/customError.js";
import userData from "../Data/userData.js";

async function getUsers() {
  try {
    return await userData.getUsers();
  } catch (error) {
    throw error;
  }
}

async function login(mail, password) {
  try {
    const user = await userData.findUserByMail(mail);
    if (user) {
      const stringPass = password.toString();
      const hashPass = user.userData.contrasena.toString();

      if (await checkPassword(stringPass, hashPass)) {
        const id = user.id;
        const mail = user.userData.correo;
        const token = generatedToken(id, mail);

        const userResponse = {
          userId: user.id,
          token: token,
          nombre: user.userData.nombre,
          apellido: user.userData.apellido,
          correo: user.userData.correo,
          ingreso: user.userData.ingreso,
          egreso: user.userData.egreso,
          perfil: user.userData.perfil,
        };
        return { success: true, status: 200, user: userResponse };
      }
    }
  } catch (error) {
    throw error;
  }
}

async function createUser(user) {
  try {
    const existingUser = await userData.findUserByMail(user.correo);

    if (existingUser) {
      throw new CustomError("User already exists", 409);
    }

    if (validateUserValues(user)) {
      user.contrasena = await bcrypt.hash(user.contrasena, 10);
      user = { ...user, ingreso: 0, egreso: 0, perfil: 0 };
      const response = await userData.createUser(user);
      const token = generatedToken(response.newUserId, response.newUser.correo);

      console.log(response);

      const userResponse = {
        userId: response.newUserId,
        token: token,
        nombre: response.newUser.nombre,
        apellido: response.newUser.apellido,
        correo: response.newUser.correo,
        ingreso: response.newUser.ingreso,
        egreso: response.newUser.egreso,
        perfil: response.newUser.perfil,
      };

      return {
        success: response.success,
        status: response.status,
        newUser: userResponse,
      };
    }
  } catch (error) {
    throw error;
  }
}

async function findUserById(userId) {
  try {
    const result = await userData.findUserById(userId);
    result.userData.contrasena = "";
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteUserById(userId) {
  try {
    const user = await findUserById(userId); //poner esto adentro del controller deleteUserByID
    if (!user) {
      throw new CustomError("User doesn't exists", 400);
    }
    return userData.deleteUserById(userId);
  } catch (error) {
    throw error;
  }
}
//test
async function updateUser(userId, userUpdate) {
  try {
    if (validateUserValues(userUpdate)) {
      const newPass = userUpdate.contrasena;
      userUpdate.contrasena = await bcrypt.hash(newPass, 10);
      return await userData.updateUser(userId, userUpdate);
    }
  } catch (error) {
    throw error;
  }
}

async function checkPassword(stringPass, hashPass) {
  const result = await bcrypt.compare(stringPass, hashPass);
  if (!result) {
    throw new CustomError("Incorrect password", 401);
  }
  return true;
}
function generatedToken(id, mail) {
  const token = jwt.sign({ id, mail }, process.env.SECRET, { expiresIn: "4h" });
  return token;
}

function validateUserValues(user) {
  if (!isValidEmail(user.correo)) {
    throw new CustomError("Invalid email", 400);
  }

  if (!user.nombre || user.nombre.trim() === "") {
    throw new CustomError("Invalid first name", 400);
  }

  if (!user.apellido || user.apellido.trim() === "") {
    throw new CustomError("Invalid last name", 400);
  }

  if (!user.contrasena || user.contrasena.trim() === "") {
    throw new CustomError("Invalid password", 400);
  }
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}

export default {
  getUsers,
  createUser,
  findUserById,
  deleteUserById,
  login,
  updateUser,
};
