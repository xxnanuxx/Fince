import connection from "./connection.js";

const collectionUsers = "usuarios";
const collectionObjectives = "objetivos";

async function getObjectives(userId) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const objectiveRef = usuarioRef.collection(collectionObjectives);
    const querySnapshot = await objectiveRef.get();
    const objectives = [];
    querySnapshot.forEach((doc) => {
      objectives.push({ objetivoId: doc.id, ...doc.data() });
    });

    return { success: true, status: 200, data: objectives };
  } catch (error) {
    throw error;
  }
}

async function createObjective(userId, objective) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const objectiveRef = await userRef.collection(collectionObjectives);
    const objectiveDoc = await objectiveRef.add(objective);
    const objectiveId = objectiveDoc.id;

    return {
      success: true,
      status: 201,
      message: `Objective ${objective.nombre} has been successfully created`,
      data: objectiveId,
    };
  } catch (error) {
    throw error;
  }
}

async function updateObjective(userId, objectiveId, objective) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const objectiveRef = await userRef
      .collection(collectionObjectives)
      .doc(objectiveId);
    const objectiveData = (await objectiveRef.get()).data();

    if (objectiveData) {
      await objectiveRef.update({
        nombre: objective.nombre,
        fecha: objective.fecha,
        monto: objective.monto,
        descripcion: objective.descripcion,
      });

      return {
        success: true,
        status: 200,
        message: "Objetive has been updated",
        objective,
      };
    }
  } catch (error) {
    throw error;
  }
}

async function deleteObjectiveById(userId, objectiveId) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    await userRef.collection(collectionObjectives).doc(objectiveId).delete();
    return {
      success: true,
      status: 200,
      message: `Objective with ID ${objectiveId} has been successfully deleted`,
    };
  } catch (error) {
    throw error;
  }
}

export default {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjectiveById,
};
