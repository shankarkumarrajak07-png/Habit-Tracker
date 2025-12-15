import React from 'react'
import Header from "../../components/Header/Header";
import Footer from '../../components/Footer/Footer'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import CTA from '../../components/landing/CTA'
import "./LandingPage.css"

export default function LandingPage() {
  return (
    <div className="app-root">
      <Header variant="landing" />
      <main>
        <div id='home'>
        <Hero />
        </div>
        <div id='feature'>
        <Features />
        </div>
        <CTA />
      </main>
      <div id='about'>
      <Footer />
      </div>
    </div>
  )
}
