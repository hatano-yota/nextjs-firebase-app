import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { User } from "../../types/User";
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { useAuthentication } from "../../hooks/authentication";
type Query = {
  uid: string;
};

const UserShow = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const query = router.query as Query;
  const { user: currentUser } = useAuthentication();
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const db = getFirestore();
    setIsSending(true);

    await addDoc(collection(db, "question"), {
      senderUid: currentUser.uid,
      receiverUid: user.uid,
      body,
      isReplied: false,
      createdAt: serverTimestamp(),
    });

    setIsSending(false);
    setBody("");
    toast.success("質問を送信しました。", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (query.uid === undefined) {
      return;
    }
    const loadUser = async () => {
      const db = getFirestore();
      const ref = doc(collection(db, "users"), query.uid);
      const userDoc = await getDoc(ref);

      if (!userDoc.exists()) {
        console.log("returned");
        return;
      }

      const gotUser = userDoc.data() as User;
      gotUser.uid = userDoc.id;
      setUser(gotUser);
    };
    loadUser();
  }, [query.uid]);

  return (
    <Layout>
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-6">
          {user ? (
            <>
              <h1 className="h4">{user.name}さんのページ</h1>
              <div className="my-3">{user.name}さんに質問しよう！</div>
            </>
          ) : (
            <p className="mb-3">ユーザーが見つかりません</p>
          )}
          <form onSubmit={onSubmit}>
            <textarea
              className="form-control"
              placeholder="お元気ですか？"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
            <div className="m-3">
              {isSending ? (
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button type="submit" className="btn btn-primary">
                  送信する
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

// visually-hidden:bootstrapのバージョンと噛み合っておらず上手く動かない

export default UserShow;
