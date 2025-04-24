import Head from "next/head"; //  for setting meta tags and page titles
// import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google"; // google fonts via next.js
import styles from "@/styles/Home.module.css";
import Navbar from "@/component/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], // oly include latin char set
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// default export of home component
export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Head>
        <title>Letterboxd</title>
        <meta name="description" content="Your movie world." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Movies, Reviews, Letterboxd" />
        <link rel="icon" href="/Icon.svg" />
      </Head>

      <Navbar />
      {/* Main content container */}

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            <span className={styles.letterboxd}>Letterboxd</span>{" "}
            <span className={styles.movies}>Movies</span>
          </h1>
          <p className={styles.subtitle}>
            Discover, rate and review your favorite films.
          </p>
          <a href="/Login" className={styles.ctaButton}>Get Started</a>
        </div>
      </div>
    </div>
  );
}