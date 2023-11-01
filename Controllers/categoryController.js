import categoryData from "../Data/categoryData.js";
import CustomError from "../Utils/customError.js";

async function getCategories(id) {
  try {
    return categoryData.getCategories(id);
  } catch (error) {
    throw error;
  }
}
async function createCategory(userId, category) {
  try {
    return categoryData.createCategory(userId, validateCategory(category));
  } catch (error) {
    throw error;
  }
}
async function updateCategory(userId, categoryId, newValues) {
  try {
    return categoryData.updateCategory(
      userId,
      categoryId,
      validateCategory(newValues)
    );
  } catch (error) {
    throw error;
  }
}

async function deleteCategory(userId, categoryId) {
  try {
    return categoryData.deleteCategory(userId, categoryId);
  } catch (error) {
    throw error;
  }
}

async function getMaxAmount(userId, categoryId) {
  try {
    return categoryData.getMaxAmount(userId, categoryId);
  } catch (error) {
    throw error;
  }
}

async function getSpentAmount(userId, categoryId) {
  try {
    return categoryData.getSpentAmount(userId, categoryId);
  } catch (error) {
    throw error;
  }
}

async function applyAmount(userId, categoryId, amount) {
  try {
    return categoryData.applyAmount(userId, categoryId, amount);
  } catch (error) {
    throw error;
  }
}

async function getCategoryById(userId, categoryId) {
  try {
    return categoryData.getCategoryById(userId, categoryId);
  } catch (error) {
    throw error;
  }
}

//Validate

function validateCategory(category) {
  const { nombre, descripcion, montoMax, tipo, montoConsumido, financiera } =
    category;

  // Ingreso = 1 -  Egreso = 0

  const tipoConv = parseInt(tipo);
  const montoMaxConv = parseFloat(montoMax);

  if (!nombre || nombre == "") {
    throw new CustomError("La categoria debe tener un nombre", 400);
  }
  if (montoMaxConv <= 0 && tipoConv == 1) {
    throw new CustomError("El monto para un Egreso debe ser mayor a 0", 400);
  }
  if (montoMaxConv > 0 && tipoConv == 0) {
    throw new CustomError("El monto para un Ingreso debe ser 0", 400);
  }

  const validCategory = {
    nombre: nombre,
    descripcion: descripcion,
    montoMax: montoMaxConv,
    tipo: tipoConv,
    montoConsumido: montoConsumido || 0,
    finaciera: financiera,
  };

  return validCategory;
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMaxAmount,
  getSpentAmount,
  applyAmount,
  getCategoryById,
};
