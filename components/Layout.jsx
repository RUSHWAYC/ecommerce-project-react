import React from 'react'
import Head from 'next/head'

import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Head>
        <title>Elecomm sound</title>
      </Head>
      <header>
        <Navbar />
      </header>
      {/* Gets children, or all files from _app that is
          getting them from index.
          _app will be loaded on every page, and as such
          header and footer will be loaded as well.*/}
      <main className="main-container">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout