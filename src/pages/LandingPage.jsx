import React from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import CTA from '../components/landing/CTA'
import '../styles/LandingPage.css'

export default function LandingPage() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
