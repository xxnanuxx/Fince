import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../Utils/customError.js";
import userData from "../Data/userData.js";
import nodemailer from 'nodemailer'

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
    } else {
      throw new CustomError("Email doesn't exists", 400);
    }
  } catch (error) {
    throw error;
  }
}

async function createUser(user) {
  try {

    if (validateUserValues(user)) {
      user.contrasena = await bcrypt.hash(user.contrasena, 10);
      user = { ...user, ingreso: 0, egreso: 0, perfil: user.perfil || 0 };
      const response = await userData.createUser(user);
      const token = generatedToken(response.newUserId, response.newUser.correo);

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

    const userResponse = {
      userId: result.id,
      nombre: result.userData.nombre,
      apellido: result.userData.apellido,
      correo: result.userData.correo,
      ingreso: result.userData.ingreso,
      egreso: result.userData.egreso,
      perfil: result.userData.perfil,
    };

    return {
      status: result.status,
      userResponse: userResponse,
    };
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

async function sendAuthCode(email) {
  try {
    const codigoVerificacion = Math.floor(1000 + Math.random() * 9000);

    const transporter = nodemailer.createTransport({
      service: process.env.FINCE_SERV,
      auth: {
        user: process.env.FINCE_MAIL,
        pass: process.env.FINCE_PWD
      }
    });

    const mailOptions = {
      from: 'APP FINCE',
      to: email,
      subject: 'Código de verificación',
      text: `Tu código de verificación es: ${codigoVerificacion}`
    };

    const info = await transporter.sendMail(mailOptions);

    if (info && info.response.includes('OK')) {
      const result = {status: 200, message: 'Código de verificación enviado', authCode: codigoVerificacion}
      return result;
    } else {
      throw new CustomError('Error al enviar el código de verificación', 500);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError(`Error in send code to mail ${email}`, 401);
    }
  }
}

async function verifyEmail(email) {
  const existingUser = await userData.findUserByMail(email);

  if (existingUser) {
    throw new CustomError("User already exists", 409);
  } else {
    return {status: 200, message: "OK"}
  }
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
  sendAuthCode,
  verifyEmail
};
