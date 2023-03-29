import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { User } from "../types/User";
import { atom, useRecoilState } from "recoil";
import { useEffect } from "react";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

const userState = atom<User>({
  key: "user",
  default: null,
});

const createUserIfNotFound = async (user: User) => {
  const db = getFirestore();
  const usersCollection = collection(db, "users");
  const userRef = doc(usersCollection, user.uid);
  const document = await getDoc(userRef);
  if (document.exists()) {
    // 書き込みのほうが高いので！
    return;
  }

  await setDoc(userRef, {
    name: "yota" + new Date().getTime(),
  });
};

export const useAuthentication = () => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user !== null) {
      return;
    }

    const auth = getAuth();
    console.log("start useEffect");
    signInAnonymously(auth).catch(function (error) {
      // Handle Errors here.
      console.error(error);
      // ...
    });

    onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        };
        console.log("set user");
        setUser(loginUser);
        createUserIfNotFound(loginUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, [user, setUser]);

  return { user };
};
