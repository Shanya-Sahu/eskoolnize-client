import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from "@/context";
import Navbar from "./components/navbar";
import { ToastContainer } from 'react-toastify'


const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "eskoolnize",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} antialiased flex justify-start`}>
        <GlobalStateProvider>
          <Navbar />
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </GlobalStateProvider>
      </body>
    </html>
  );
}
