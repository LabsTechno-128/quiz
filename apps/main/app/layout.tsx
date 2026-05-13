import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/shere/Navber";
import Footer from "../components/shere/Footer";
import { Providers } from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinkhive",
  description: "Thinkhive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/embed.js"
        ></script>
        <link rel="icon" href="/logo.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* seo add where  */}
        <Providers>
          <div className="container mx-auto">
            <Navbar></Navbar>
          </div>
          <div className="container mx-auto">
            {children}
          </div>
          <div className="container mx-auto">
            <Footer></Footer>
          </div>
        </Providers>

      </body>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body> */}
    </html>
  );
}
