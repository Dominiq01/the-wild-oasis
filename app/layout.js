import { Josefin_Sans } from "next/font/google";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

import Header from "./_components/Header";
import "@/app/_styles/globals.css";
import ReservationContextProvider from "./_components/ReservationContext";

export const metadata = {
  title: {
    template: "%s - The Wild Oasis",
    default: "Welcome - The Wild Oasis",
  },
  description:
    "Luxurius cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`relative flex flex-col ${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen`}
      >
        <Header />
        <div className="grid flex-1 px-8 py-12">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationContextProvider>{children}</ReservationContextProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
