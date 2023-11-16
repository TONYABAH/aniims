import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app);

export const createUser = httpsCallable(functions, "register");
export const listUsers = httpsCallable(functions, "listusers");
export const getUser = httpsCallable(functions, "getuser");
export const deleteUsers = httpsCallable(functions, "deleteusers");
export const getUserEmail = httpsCallable(functions, "getuseremail");
export const getuserbyemail = httpsCallable(functions, "getuserbyemail");
export const getuserbyphonenumber = httpsCallable(
  functions,
  "getuserbyphonenumber"
);
export const updateUser = httpsCallable(functions, "updateuser");
export const recoverEmail = httpsCallable(functions, "recoveremail");
export const resetPassword = httpsCallable(functions, "resetpassword");
export const setUserRights = httpsCallable(functions, "setuserrights");
export const sendSMS = httpsCallable(functions, "sendsms");
export const addIPO = httpsCallable(functions, "addipo");
export const addUnit = httpsCallable(functions, "addunit");
export const addCompany = httpsCallable(functions, "addcompany");
export const createDocument = httpsCallable(functions, "createdocument");
export const updateDocument = httpsCallable(functions, "updatedocument");
