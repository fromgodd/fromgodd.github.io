import { useEffect, useRef, useState } from 'react'
import './App.css'

/* ── Logo with white-bg → transparent via Canvas ── */
function TransparentLogo({ src, alt, className }) {
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const threshold = 240

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        // Remove near-white pixels
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0 // transparent
        }
      }
      ctx.putImageData(imageData, 0, 0)
      setLoaded(true)
    }
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      className={`${className} ${loaded ? 'logo-visible' : 'logo-hidden'}`}
      aria-label={alt}
      role="img"
    />
  )
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#hero" className="nav__brand">
          <TransparentLogo src="/logo1.png" alt="Neumann Dispatch Labs" className="nav__logo" />
          <span className="nav__name">Neumann Dispatch Labs</span>
        </a>
        <ul className="nav__links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#centralfleet">CentralFleet</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__grid-bg" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content">
        <div className="hero__badge">
          <span className="badge__dot" />
          Trucking Automation & Compliance
        </div>
        <h1 className="hero__title">
          We automate the<br />
          <span className="hero__title--accent">trucking industry.</span>
        </h1>
        <p className="hero__sub">
          From FMCSA filings to ELD/HOS integrations and AI-powered dispatch tools —
          we build the software that keeps fleets moving and compliant.
        </p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">View Projects</a>
          <a href="#contact" className="btn btn--ghost">Get in Touch</a>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <span className="stat__val">DOT</span>
            <span className="stat__label">Compliance</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__val">FMCSA</span>
            <span className="stat__label">Automation</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__val">ELD</span>
            <span className="stat__label">HOS Integration</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── About ── */
function About() {
  const pillars = [
    {
      icon: '🚛',
      title: 'Industry Focus',
      desc: 'Deep-rooted in trucking operations, dispatch workflows, and federal compliance requirements.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      desc: 'Leveraging large language models to parse rate confirmations, automate documentation, and reduce manual data entry.',
    },
    {
      icon: '📡',
      title: 'Full Integration',
      desc: 'Connecting telematics platforms, ELD providers, and dispatch systems into a single automated pipeline.',
    },
    {
      icon: '⚖️',
      title: 'Compliance-First',
      desc: 'Built around FMCSA regulations and DOT standards so fleets stay compliant without the overhead.',
    },
  ]

  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="section__header">
          <span className="section__tag">About</span>
          <h2 className="section__title">Built for the roads ahead</h2>
          <p className="section__desc">
            Neumann Dispatch Labs is a developer-led lab focused on one thing — eliminating the
            manual, error-prone work that slows trucking operations down.
          </p>
        </div>
        <div className="pillars">
          {pillars.map((p) => (
            <div key={p.title} className="pillar">
              <div className="pillar__icon">{p.icon}</div>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Projects ── */
const PROJECTS = [
  {
    tag: 'AI · Document Processing',
    title: 'AI Rate Confirmation Analyzer',
    desc: 'Automatically extracts, validates, and logs data from rate confirmations using AI. No more manual entry — drop the PDF, get structured data.',
    icon: '📄',
    accent: 'blue',
    status: 'coming-soon',
  },
  {
    tag: 'Automation · Messaging',
    title: 'Telegram Dispatch Bot',
    desc: 'A Telegram-native bot for dispatch teams. Send loads, receive confirmations, get alerts — all without leaving the chat.',
    icon: '✈️',
    accent: 'green',
    status: 'coming-soon',
  },
  {
    tag: 'Telematics · GPS',
    title: 'Telematics Integration Layer',
    desc: 'Unified API bridge connecting major telematics providers. Real-time vehicle data flowing into your dispatch and compliance stack.',
    icon: '📡',
    accent: 'purple',
    status: 'coming-soon',
  },
  {
    tag: 'Compliance · ELD · HOS',
    title: 'ELD / HOS Compliance Engine',
    desc: 'Automated Hours-of-Service monitoring and ELD data sync. Flags violations before they become citations.',
    icon: '⏱️',
    accent: 'orange',
    status: 'coming-soon',
  },
]

function ProjectCard({ project }) {
  return (
    <div className={`project-card project-card--${project.accent}`}>
      <div className="project-card__top">
        <span className="project-card__icon">{project.icon}</span>
        <span className="project-card__status">Coming Soon</span>
      </div>
      <span className="project-card__tag">{project.tag}</span>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__desc">{project.desc}</p>
      <div className="project-card__footer">
        <span className="project-card__wip">In Development</span>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section__header">
          <span className="section__tag">Projects</span>
          <h2 className="section__title">What we're building</h2>
          <p className="section__desc">
            A suite of tools designed to automate every layer of the trucking stack.
            All projects are currently in active development.
          </p>
        </div>
        <div className="projects__grid">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CentralFleet Spotlight ── */
function CentralFleet() {
  const features = [
    { icon: '🛡️', label: 'Safety & Compliance' },
    { icon: '🚨', label: 'D.O.T. & Accidents' },
    { icon: '🔍', label: 'Inspections' },
    { icon: '📊', label: 'Fleet Board & Dashboard' },
    { icon: '🤖', label: 'AI Integration' },
    { icon: '⚖️', label: 'Weight Mile & IFTA' },
    { icon: '🗺️', label: 'Permits Management' },
    { icon: '🧮', label: 'Auto Calculations' },
  ]

  return (
    <section className="section centralfleet" id="centralfleet">
      <div className="container">
        <div className="cf__inner">
          {/* Left: text side */}
          <div className="cf__text">
            <div className="cf__eyebrow">
              <span className="cf__flagship-badge">⭐ Flagship Project</span>
              <span className="project-card__status" style={{ marginLeft: 10 }}>Coming Soon</span>
            </div>
            <h2 className="cf__title">
              <span className="cf__title--brand">CentralFleet</span><br />
              Complete fleet management,<br />in one platform.
            </h2>
            <p className="cf__desc">
              A mini TMS built from the ground up for trucking companies.
              Manage your whole fleet — permits, IFTA filings, DOT inspections,
              accident records, and live dashboards — without juggling five different tools.
            </p>
            <div className="cf__features">
              {features.map((f) => (
                <div key={f.label} className="cf__feature">
                  <span className="cf__feature-icon">{f.icon}</span>
                  <span className="cf__feature-label">{f.label}</span>
                </div>
              ))}
            </div>
            <div className="cf__actions">
              <a href="#contact" className="btn btn--primary">Get Early Access</a>
              <span className="cf__notice">Free for early adopters</span>
            </div>
          </div>

          {/* Right: banner image */}
          <div className="cf__visual">
            <div className="cf__img-wrap">
              <div className="cf__img-glow" aria-hidden="true" />
              <img
                src="/centralfleetbanner.png"
                alt="CentralFleet — Complete Fleet Management Platform"
                className="cf__img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Contact ── */
function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__box">
          <div className="contact__glow" aria-hidden="true" />
          <span className="section__tag">Contact</span>
          <h2 className="contact__title">Interested in what we're building?</h2>
          <p className="contact__desc">
            Reach out if you're in the trucking industry and want to talk automation,
            or if you'd like to collaborate on any of these tools.
          </p>
          <a
            href="mailto:hello@neumanndispatchlabs.com"
            className="btn btn--primary contact__btn"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <TransparentLogo src="/logo1.png" alt="Neumann Dispatch Labs" className="footer__logo" />
          <span className="footer__name">Neumann Dispatch Labs</span>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} Neumann Dispatch Labs. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ── App ── */
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <CentralFleet />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
