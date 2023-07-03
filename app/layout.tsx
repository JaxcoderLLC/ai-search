import Image from 'next/image';
import { AnalyticsWrapper } from './components/analytics';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="wrapper">
          {children}
          <AnalyticsWrapper />
        </div>
        <footer className="footer">
           <a target="_blank" rel="no-opener noreferrer" href="https://github.com/codenamejason/the-contractor">
           <Image style={{ marginTop: '2px'}} alt="code available on github" width="18" height="18" src="/github.svg" />
           </a>
            <p>
            Built with 🫶 by <a target="_blank" rel="no-opener noreferrer" href="https://twitter.com/codenamejason">@codenamejason</a> <a className="sponsor" target="_blank" rel="no-opener noreferrer" href="https://github.com/codenamejason/the-contractor">🫡 Sponsor this project</a>
            </p>
        </footer>
      </body>
    </html>
  )
}
