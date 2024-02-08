import { app } from "./firebase";

import {
  doc,
  addDoc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getIdToken,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import {
  //getUserEmail,
  getUser,
  getStaffById,
  getuserByemail,
  getuserByPhonenumber,
} from "./functions";

const db = getFirestore(app);

function isStaffNumber(val) {
  const pattern = /^(ss|SS|js|JS)[0-9]+$/;
  return pattern.test(val);
}
function isPhoneNumber(val) {
  const pattern = /^[0-9]+$/;
  return pattern.test(val);
}
function isEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val);
}

export const getUserToken = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const idToken = await getIdToken(user);
        /*getAuth()
          .verifyIdToken(idToken)
          .then((decodedToken) => {
            //const uid = decodedToken.uid;
            console.log(decodedToken);
          })
          .catch((error) => {
            // Handle error
          });*/
        resolve(idToken);
      } else {
        console.log("User not logged in");
        resolve(null);
      }
      unsubscribe();
    });
  });
};

export const sendSignInEmailLink = (email) => {
  const auth = getAuth(app);
  sendSignInLinkToEmail(auth, email, {
    url: "https://ienforce.web.app/profile",
  })
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem("emailForSignIn", email);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
};

export function loginUserFromEmailLink() {
  //Landing page
  // Confirm the link is a sign-in with email link.
  const auth = getAuth(app);
  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt("Please provide your email for confirmation");
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem("emailForSignIn");
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }
}

export const registerUserWithEmailAndPassword = (username, password, role) => {
  const auth = getAuth(app);
  return createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return Promise.resolve(user);
    })
    .catch((error) => {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      //throw error;
      return Promise.reject(error);
    });
};

export const loginUserWithEmailAndPassword = async (email, password) => {
  const auth = getAuth(app);
  let userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return user;
};

export const logOut = async () => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    localStorage.removeItem("aniims_idtoken");
    localStorage.removeItem("aniims_user");
    return true;
  } catch (error) {
    // return false;
    throw error;
  }
};
export const signInWithEmailAndPasswrd = async (email, password) => {
  const auth = getAuth(app);
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  return { user };
};
export const signInWithEmail = async (email) => {
  const response = await getuserByemail({ email });
  return response?.data?.email;
};
export const signInWithStaffId = async (id) => {
  const response = await getStaffById({ staffId: id });
  //console.log(response);
  return response?.data?.Email;
};
export const signInWithPhoneLine = async (id) => {
  const response = await getuserByPhonenumber({ phone: id });
  return response?.data?.email;
};
/**
 *
 * @param {*} id User Email, Phone number or Staff ID
 * @returns User
 */
export const getAuthUser = async (id) => {
  if (isEmail(id)) return await signInWithEmail(id);
  if (isPhoneNumber(id)) return await signInWithPhoneLine(id);
  else if (isStaffNumber(id)) return await signInWithStaffId(id);
  else
    throw {
      message: "Invalid User ID, must be email, phone number or staff ID",
    };
};
export const signIn = async (id, password) => {
  if (isEmail(id)) return await signInWithEmail(id, password);
  if (isPhoneNumber(id)) return await signInWithPhoneLine(id, password);
  else if (isStaffNumber(id)) return await signInWithStaffId(id, password);
  else throw { message: "Invalid User ID" };
};

export const getStaff = async (id) => {
  const q = query(collection(db, "staff"), where("email", "==", id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};
export function isAuthenticated() {
  //console.log(getAuth().currentUser);
  return getAuth().currentUser !== null;
}
