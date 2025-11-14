export const metadata = {
  title: "Time Fetcher",
  description: "Fetches and prints time every 5 minutes"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji',
        background: '#0b1020',
        color: '#e6eaf2',
        minHeight: '100vh',
        margin: 0
      }}>
        {children}
      </body>
    </html>
  );
}
