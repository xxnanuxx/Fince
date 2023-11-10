import connection from "../Data/connection.js";
import CustomError from "../Utils/customError.js";

const collectionUsers = "usuarios";
const collectionCategories = "categorias";

async function getCategories(userId) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const categoriaRef = usuarioRef.collection(collectionCategories);
    const querySnapshot = await categoriaRef.get();
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, status: 200, data: categories };
  } catch (error) {
    throw error;
  }
}

async function createCategory(userId, category) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const categoryRef = await userRef.collection(collectionCategories);
    const categoryDoc = await categoryRef.add(category);
    const categoryId = categoryDoc.id;

    return {
      success: true,
      status: 201,
      message: `Category ${category.nombre} has been successfully created`,
      data: categoryId,
    };
  } catch (error) {
    throw error;
  }
}

async function updateCategory(userId, categoryId, category) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const categoryRef = await userRef
      .collection(collectionCategories)
      .doc(categoryId);
    const categoryData = (await categoryRef.get()).data();

    if (categoryData) {
      await categoryRef.update({
        nombre: category.nombre,
        descripcion: category.descripcion,
        montoMax: category.montoMax,
        tipo: category.tipo,
      });

      return {
        success: true,
        status: 200,
        message: "Category has been updated",
        category,
      };
    }
  } catch (error) {
    throw error;
  }
}

async function deleteCategory(userId, categoryId) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const categoryRef = await userRef
      .collection(collectionCategories)
      .doc(categoryId);
    await categoryRef.delete();
    return {
      success: true,
      status: 200,
      message: `Category with ID: ${categoryId} belonging to user with ID: ${userId} has been successfully deleted`,
    };
  } catch (error) {
    throw error;
  }
}

async function getMaxAmount(userId, categoryId) {
  try {
    const db = await connection();
    const usuarioRef = await db.collection(collectionUsers).doc(userId);
    const categoriaRef = await usuarioRef
      .collection(collectionCategories)
      .doc(categoryId);
    const doc = await categoriaRef.get();
    if (doc.exists) {
      const category = { id: doc.id, ...doc.data() };
      return category.montoMax;
    } else {
      throw new CustomError("Category doesn't exists");
    }
  } catch (error) {
    throw error;
  }
}

async function getSpentAmount(userId, categoryId) {
  try {
    const db = await connection();
    const usuarioRef = await db.collection(collectionUsers).doc(userId);
    const categoriaRef = await usuarioRef
      .collection(collectionCategories)
      .doc(categoryId);
    const doc = await categoriaRef.get();
    if (doc.exists) {
      const category = { id: doc.id, ...doc.data() };
      return category.montoConsumido;
    } else {
      throw new CustomError("Category doesn't exists");
    }
  } catch (error) {
    throw error;
  }
}

async function applyAmount(userId, categoryId, amount) {
  try {
    const db = await connection();
    const userRef = db.collection(collectionUsers).doc(userId);
    const categoryRef = userRef
      .collection(collectionCategories)
      .doc(categoryId);
    const categoryData = (await categoryRef.get()).data();

    if (categoryData) {
      const montoConsumido = categoryData.montoConsumido + amount;
      await categoryRef.update({
        montoConsumido: montoConsumido,
      });
    }
  } catch (error) {
    throw error;
  }
}

async function getCategoryById(userId, categoryId) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const categoriaRef = usuarioRef
      .collection(collectionCategories)
      .doc(categoryId);
    const categoryDoc = await categoriaRef.get();
    if (categoryDoc.exists) {
      const categoryData = categoryDoc.data();
      categoryData.id = categoryId;
      return { success: true, status: 200, data: categoryData };
    } else {
      return {
        success: false,
        status: 404,
        message: "Categoría no encontrada",
      };
    }
  } catch (error) {
    throw error;
  }
}

async function getCategoryByName(userId, categoryName) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const querySnapshot = await usuarioRef
      .collection(collectionCategories)
      .where("nombre", "==", categoryName)
      .get();

    if (!querySnapshot.empty) {
      const categoryDoc = querySnapshot.docs[0];

      if (categoryDoc && categoryDoc.exists) {
        const category = categoryDoc.data();
        category.id = categoryDoc.id;
        return { success: true, status: 200, data: category };
      } else {
        return {
          success: false,
          status: 404,
          message: "Categoría no encontrada",
        };
      }
    } else {
      return {
        success: false,
        status: 404,
        message: "Categoría no encontrada",
      };
    }
  } catch (error) {
    throw error;
  }
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  applyAmount,
  getMaxAmount,
  getSpentAmount,
  getCategoryById,
  getCategoryByName,
};
