import connection from "../Data/connection.js";
import CustomError from "../Utils/customError.js";

const collectionUsers = "usuarios";

async function getUsers() {
  try {
    const db = await connection();
    const querySnapshot = await db.collection(collectionUsers).get();
    let users = [];
    users = querySnapshot.docs.map((doc) => {
      return { userId: doc.id, userData: doc.data() };
    });

    return { success: true, status: 200, result: users };
  } catch (error) {
    throw error;
  }
}

async function findUserByMail(mail) {
  try {
    const db = await connection();
    const querySnapshot = await db
      .collection(collectionUsers)
      .where("correo", "==", mail)
      .get();

    if (querySnapshot.exists) {
      throw new CustomError("User doesn't exists", 404);
    }

    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    return { id: userId, userData: userData };
  } catch (error) {
    throw error;
  }
}

async function createUser(newUser) {
  try {
    const db = await connection();
    const userRef = await db.collection("usuarios").add(newUser);
    const newUserId = userRef.id;
    return {
      success: true,
      status: 201,
      newUserId: newUserId,
      newUser: newUser,
    };
  } catch (error) {
    throw error;
  }
}

async function findUserById(userId) {
  try {
    const db = await connection();
    const userDoc = await db.collection(collectionUsers).doc(userId).get();

    if (!userDoc.exists) {
      throw new CustomError("User doesn't exists", 404);
    }

    return { success: true, status: 200, id: userId, userData: userDoc.data() };
  } catch (error) {
    throw error;
  }
}

async function deleteUserById(userId) {
  try {
    const db = await connection();
    await db.collection(collectionUsers).doc(userId).delete();
    return {
      success: true,
      status: 200,
      message: `User with ID ${userId} has been successfully deleted`,
    };
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, userNewValues) {
  try {
    const db = await connection();
    const userRef = db.collection(collectionUsers).doc(userId);
    const result = await userRef.update({
      nombre: userNewValues.nombre,
      apellido: userNewValues.apellido,
      correo: userNewValues.correo,
      contrasena: userNewValues.contrasena,
      perfil: userNewValues.perfil,
    });
    console.log(userNewValues)
    return {
      success: true,
      status: 200,
      updateData: userNewValues,
    };
  } catch (error) {
    throw error;
  }
}

export default {
  getUsers,
  createUser,
  findUserByMail,
  findUserById,
  deleteUserById,
  updateUser,
};
