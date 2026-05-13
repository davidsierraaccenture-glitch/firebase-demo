import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../components/AuthProvider";
import AnalyticsProvider from "../components/AnalyticsProvider";
import PerformanceProvider from "../components/PerformanceProvider";

export const metadata = {
  title: "Acme Shop",
  description: "Quality products, delivered fast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AnalyticsProvider />
          <PerformanceProvider />
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
