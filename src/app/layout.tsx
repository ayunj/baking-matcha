import type { Metadata } from "next";
import { Lora, Noto_Sans_KR } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "융융의 베이킹노트",
  description: "베이킹 레시피와 재료 창고",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${noto.variable} ${lora.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-noto), 'Noto Sans KR', sans-serif",
        }}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
