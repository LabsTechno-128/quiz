import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/shere/Navber";
import Footer from "./components/shere/Footer";
import { AuthProvider } from "./contexts/AuthContext";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* seo add where  */}
   <AuthProvider>
    <div className="max-w-[1440px] mx-auto">
          <Navbar></Navbar>
        </div>
        {children}
        <div className="max-w-[1440px] mx-auto">
          <Footer></Footer>
        </div>
   </AuthProvider>
        
      </body>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body> */}
    </html>
  );
}
