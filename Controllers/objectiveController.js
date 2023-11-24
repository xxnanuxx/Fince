import objectiveData from "../Data/objectiveData.js";

async function getObjectives(userId) {
  try {
    return await objectiveData.getObjectives(userId);
  } catch (error) {
    throw error;
  }
}

async function createObjective(userId, objective) {
  try {
    return await objectiveData.createObjective(userId, objective);
  } catch (error) {
    throw error;
  }
}

async function updateObjective(userId, objectiveId, objectiveUpdated) {
  try {
    return await objectiveData.updateObjective(
      userId,
      objectiveId,
      objectiveUpdated
    );
  } catch (error) {
    throw error;
  }
}

async function deleteObjectiveById(userId, objectiveId) {
  try {
    return await objectiveData.deleteObjectiveById(userId, objectiveId);
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
