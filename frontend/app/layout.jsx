import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CineSnap Ultra - Professional AI Background Removal',
  description: 'Ultra-advanced AI background removal with edge detection and professional alpha matting. Remove backgrounds instantly with studio-grade quality.',
  keywords: 'background removal, AI, image editing, remove background, transparent background, photo editing',
  authors: [{ name: 'Rameen Shahid' }],
  openGraph: {
    title: 'CineSnap Ultra - AI Background Removal',
    description: 'Remove backgrounds with ultra-precision AI technology',
    url: 'https://cinesnap.com',
    siteName: 'CineSnap Ultra',
    images: [
      {
        url: 'https://cinesnap.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CineSnap Ultra - AI Background Removal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineSnap Ultra - AI Background Removal',
    description: 'Remove backgrounds with ultra-precision AI technology',
    images: ['https://cinesnap.com/twitter-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800&display=swap" 
          rel="stylesheet"
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e2436',
              color: '#fff',
              borderRadius: '2rem',
              padding: '0.75rem 1.5rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}