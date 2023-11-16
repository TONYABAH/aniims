const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { getAuth } = require("firebase-admin/auth");

// Start listing users = require(the beginning, 1000 at a time.
const listAllUsers = (users, nextPageToken) => {
  // List batch of users, 1000 at a time.
  return getAuth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        users.push(userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(users, listUsersResult.pageToken);
      }
      return Promise.resolve(users);
    })
    .catch((error) => {
      console.log("Error listing users:", error);
      Promise.reject(error);
    });
};
async function deleteUsers(uids = []) {
  try {
    //let result = 0;
    const deleteUsersResult = await getAuth().deleteUsers([...uids]);
    if (deleteUsersResult.successCount > 0) {
      logger.log(
        `Successfully deleted ${deleteUsersResult.successCount} users`
      );
      deleteUsersResult.errors.forEach((err) => {
        logger.log(err.error.toJSON());
      });
      //result = deleteUsersResult;
      return true;
    } else if (deleteUsersResult.failureCount > 0) {
      throw {
        message: `Failed to delete ${deleteUsersResult.failureCount} users`,
      };
    }
  } catch (error) {
    // console.log("Error deleting users:", error);
    //logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
}
exports.deleteusers = onCall(async (request) => {
  try {
    return await deleteUsers(request.data.uids);
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});

exports.listusers = onCall(async (request) => {
  try {
    const users = [];
    return await listAllUsers(users);
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});

exports.getuser = onCall(async (request) => {
  try {
    await listAllUsers();
    return users.filter((u) => u.email === request.data.email);
  } catch (error) {
    logger.error(error.message);
    throw new HttpsError("unknown", error.message);
  }
});
