import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useAuthentication } from "../hooks/authentication";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { user } = useAuthentication();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/page2">
            <a>Go to page2</a>
          </Link>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>{user?.uid || "未ログイン"}</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
