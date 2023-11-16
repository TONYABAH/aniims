import { useCollection, useDocument } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "./firebase";

const userCollection = collection(firestore, "Users");

export function useStaffList() {
  const staffDataSource = query(
    userCollection,
    where("Level", "==", 3)
    //where("Active", "==", true)
  );
  return useCollection(staffDataSource);
}
export function useIPOList() {
  const policeDataSource = query(
    userCollection,
    where("Level", "==", 2)
    //where("Active", "==", true)
  );
  let ipoList = useCollection(policeDataSource);
  return ipoList;
}
export const validation = {
  isStaffNumber: (val) => {
    const pattern = /^(ss|SS|js|JS)[0-9]+$/;
    return pattern.test(val) || "Staff number not valid.";
  },
  isPhoneNumber: (val) => {
    const pattern = /^[0-9]+$/;
    return pattern.test(val) || "Phone number not valid";
  },
  isEmail: (val) => {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || "Email not valid";
  },
  required: (val) => {
    return (val && val.length > 0) || "Required field";
  },
};
