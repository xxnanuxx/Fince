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

async function findUserByMail(mail, login) {
  try {
    let userId = ""
    let userData = ""

    const db = await connection();
    const querySnapshot = await db
      .collection(collectionUsers)
      .where("correo", "==", mail)
      .get();
    
    if (login) {
      if (querySnapshot.empty) {
        throw new CustomError("User doesn't exists", 404);
      }
    }

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      userId = userDoc.id;
      userData = userDoc.data()
    } else {
      return null
    }

    return { id: userId, userData: userData };
  } catch (error) {
    console.log(error)
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

    if (userDoc.empty) {
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
      perfil: userNewValues.perfil,
    });

    if (userNewValues.contrasena.trim().length !== 0) {
      await userRef.update({
        contrasena: userNewValues.contrasena
      })
    }

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
