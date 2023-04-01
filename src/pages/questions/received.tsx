import { useEffect, useRef, useState } from "react";
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { useAuthentication } from "../../hooks/authentication";
import { Question } from "../../types/Question";
import Layout from "../../components/Layout";
import dayjs from "dayjs";
import Link from "next/link";

const QuestionsReceived = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { user } = useAuthentication();
  const [isPaginationFinished, setIsPaginationFinished] = useState(false);
  const scrollContainerRef = useRef(null);

  const createBaseQuery = () => {
    const db = getFirestore();
    return query(
      collection(db, "questions"),
      where("receiverUid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10),
    );
  };

  const appendQuestions = (snapshot: QuerySnapshot<DocumentData>) => {
    const gotQuestions = snapshot.docs.map((doc) => {
      const question = doc.data() as Question;
      question.id = doc.id;
      return question;
    });
    setQuestions(questions.concat(gotQuestions));
  };

  const loadQuestions = async () => {
    const snapshot = await getDocs(createBaseQuery());

    if (snapshot.empty) {
      console.log("snapshot.empty");
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapshot);
  };

  const onScroll = () => {
    if (isPaginationFinished) {
      return;
    }

    const container = scrollContainerRef.current;
    if (container === null) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.top + rect.height > window.innerHeight) {
      return;
    }

    loadNextQuestions();
  };

  const loadNextQuestions = async () => {
    if (questions.length === 0) {
      return;
    }

    const lastQuestion = questions[questions.length - 1];
    const snapshot = await getDocs(query(createBaseQuery(), startAfter(lastQuestion.createdAt)));
    if (snapshot.empty) {
      return;
    }

    appendQuestions(snapshot);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [questions, scrollContainerRef.current, isPaginationFinished]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (user === null) {
      console.log("user === null");
      return;
    }

    loadQuestions();
  }, [user]);

  return (
    <Layout>
      <h1 className="h4">受け取った質問一覧</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
          {questions.map((question) => (
            <Link href={`/questions/${question.id}`} key={question.id}>
              <a>
                <div className="card my-3">
                  <div className="card-body">
                    <div className="text-truncate">{question.body}</div>
                    <div>
                      <small className="text-muted text-end">
                        {dayjs(question.createdAt.toDate()).format("YYYY/MM/DD HH:mm")}
                      </small>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default QuestionsReceived;
