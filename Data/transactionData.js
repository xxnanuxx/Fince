import connection from "../Data/connection.js";

const collectionUsers = "usuarios";
const collectionTransactions = "transacciones";

async function createTransaction(userId, transaction) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const transactionRef = await userRef
      .collection(collectionTransactions)
      .add(transaction);
    const transactionId = transactionRef.id;
    transaction.id = transactionId;
    return { success: true, status: 201, data: transaction };
  } catch (error) {
    throw error;
  }
}

async function getTransactions(userId) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const transactionRef = userRef.collection(collectionTransactions);
    const querySnapshot = await transactionRef.get();
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    const result = {
      success: true,
      status: 200,
      transactions: transactions,
    };
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteTransaction(userId, transactionId) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const transactionRef = await userRef.collection(collectionTransactions);
    await transactionRef.doc(transactionId).delete();

    const result = {
      success: true,
      status: 200,
      message: `Transaction with ID: ${transactionId} belonging to user with ID: ${userId} has been successfully deleted`,
    };
    return result;
  } catch (error) {
    throw error;
  }
}

async function getTransactionsByCategory(userId, categoryId) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const transactionRef = await userRef.collection(collectionTransactions);
    const querySnapshot = await transactionRef
      .where("categoriaId", "==", categoryId)
      .get();
    var listaTransacciones = [];

    querySnapshot.forEach((doc) => {
      var transaccion = doc.data();
      listaTransacciones.push(transaccion);
    });

    const result = {
      success: true,
      status: 200,
      transactions: listaTransacciones,
    };
    return result;
  } catch (error) {
    throw error;
  }
}

export default {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getTransactionsByCategory,
};
