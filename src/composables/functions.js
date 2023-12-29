import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app);

export const createUser = httpsCallable(functions, "register");
export const listUsers = httpsCallable(functions, "listusers");
export const deleteUsers = httpsCallable(functions, "deleteusers");
export const getUser = httpsCallable(functions, "getuser");
export const getStaffById = httpsCallable(functions, "getstaffbyid");
export const getuserByemail = httpsCallable(functions, "getuserbyemail");
export const getuserByPhonenumber = httpsCallable(
  functions,
  "getuserbyphonenumber"
);
export const updateUser = httpsCallable(functions, "updateuser");
export const recoverEmail = httpsCallable(functions, "recoveremail");
export const resetPassword = httpsCallable(functions, "resetpassword");
export const setUserRights = httpsCallable(functions, "setuserrights");
export const sendSMS = httpsCallable(functions, "sendtextmessage");
export const addIPO = httpsCallable(functions, "addipo");
export const addUnit = httpsCallable(functions, "addunit");
export const addUser = httpsCallable(functions, "adduser");
export const createDocument = httpsCallable(functions, "createdocument");
export const updateDocument = httpsCallable(functions, "updatedocument");
