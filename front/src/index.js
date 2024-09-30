import React, { useState,useRef } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

import './style.css'
import Navbar8 from './components/navbar8'
import Hero17 from './components/hero17'
import Features24 from './components/features24'
import CTA26 from './components/cta26'
import Features25 from './components/features25'
import Steps2 from './components/steps2'
import Testimonial17 from './components/testimonial17'
import NewsLetter from './components/NewsLetter'
import Footer4 from './components/footer4'
import GetTickets from './components/GetTickets';
import MovieTicket from './components/MovieTicket';
import ConcertTicket from './components/ConcertTicket';
import SportsTicket from './components/SportsTicket';
import Live from './components/Live'
import ScrollAnimation from './components/ScrollAnimation'
import Contact from './components/Contact';

const App = () => {
  const ctaRef = useRef(null);
  return (
    <Router>
      <Routes>
      <Route path="/" element={
          <>
            <Navbar8 ctaRef={ctaRef}/>
            <ScrollAnimation animationClass="fade-in">
                <Hero17 />
              </ScrollAnimation>
              <ScrollAnimation animationClass="slide-in">
                <Features24 />
              </ScrollAnimation>
              <ScrollAnimation animationClass="fade-in">
                <CTA26 ref={ctaRef} />
              </ScrollAnimation>
              <ScrollAnimation animationClass="slide-in">
                <Features25 />
              </ScrollAnimation>
              <ScrollAnimation animationClass="fade-in">
                <Steps2 />
              </ScrollAnimation>
              <ScrollAnimation animationClass="slide-in">
                <Testimonial17 />
              </ScrollAnimation>
              <ScrollAnimation animationClass="fade-in">
                <NewsLetter />
              </ScrollAnimation>
            <Footer4 />
          </>
        } />
        <Route path="/GetTickets" element={<GetTickets />} />
        <Route path="/MovieTicket" element={<MovieTicket />} />
        <Route path="/ConcertTicket" element={<ConcertTicket />} />
        <Route path="/SportsTicket" element={<SportsTicket />} />
        <Route path="/Live" element={<Live />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
