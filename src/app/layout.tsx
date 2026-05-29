import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import "./globals.css";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "나의 레시피 노트",
  description: "베이킹·음식·음료 레시피와 재료 창고",
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
    <html lang="ko" className={noto.variable}>
      <body
        style={{
          fontFamily: "var(--font-noto), 'Noto Sans KR', sans-serif",
        }}
      >
        <SupabaseProvider>
          <AppProvider>{children}</AppProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
