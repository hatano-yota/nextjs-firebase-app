import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { User } from "../models/User";
import { atom, useRecoilState } from "recoil";
import { useEffect } from "react";

const userState = atom<User>({
  key: "user",
  default: null,
});

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user !== null) {
      return;
    }

    const auth = getAuth();

    console.log("Start useEffect");

    signInAnonymously(auth).catch(function (error) {
      // Handle Errors here.
      console.error(error);
      // ...
    });

    onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        console.log("Set User");
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return { user };
}
// 2度呼ばれる～
