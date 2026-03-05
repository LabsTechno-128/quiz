import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "./components/layout";
import { ToastContainer } from "react-toastify";
import { DeleteModalProvider } from "./context/DeleteModalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinkhive Admin",
  description: "Thinkhive Admin",
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
        <div className="  min-h-screen">
          <DeleteModalProvider>
            <Layout>
              <ToastContainer />
              {children}
            </Layout>
          </DeleteModalProvider>
        </div>
      </body>
    </html>
  );
}
