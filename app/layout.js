import "./globals.css";
import { Providers } from "../utils/provider";

export const metadata = {
  title: "LMS Project",
  description: "Learning Management System for students and educators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
