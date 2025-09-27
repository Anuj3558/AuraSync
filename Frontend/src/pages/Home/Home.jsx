import React, { useState, useEffect } from 'react';
import { Menu, X, Brain, Zap, BarChart3, CheckCircle, Mail, Phone, Twitter, Github, Linkedin, Star, ArrowRight, Play, Users, Clock, Target } from 'lucide-react';
import { Helmet } from 'react-helmet';
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechFlow",
      content: "AuraSync transformed our hiring process. We reduced interview time by 60% while improving candidate quality.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Talent",
      company: "InnovateCorp",
      content: "The real-time insights are game-changing. Our interviewers now have data-driven confidence in their decisions.",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Recruitment Lead",
      company: "FutureTech",
      content: "Candidates love the experience. It's fair, consistent, and actually enjoyable for both sides.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', company: '', message: '' });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Intelligent Assessment",
      description: "Adaptive questioning tailored to specific roles and skill levels with deep learning algorithms."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Real-time Sync",
      description: "Live dashboard updates and instant scoring for interviewers with seamless collaboration."
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Data-Driven Insights",
      description: "Comprehensive analytics and AI-generated candidate summaries for informed decisions."
    }
  ];

  const services = [
    {
      title: "Intelligent Resume Parsing",
      description: "AI instantly extracts key details from resumes and collects missing information automatically.",
      features: ["Automated data extraction", "Missing field detection", "Profile completion"]
    },
    {
      title: "Adaptive AI Interviews",
      description: "Role-specific questions that adapt from easy to hard based on candidate responses.",
      features: ["Dynamic difficulty adjustment", "Real-time evaluation", "Timed assessments"]
    },
    {
      title: "Real-time Dashboard",
      description: "Live monitoring with instant scoring and comprehensive candidate insights.",
      features: ["Live progress tracking", "Instant AI scoring", "Detailed summaries"]
    }
  ];

  const stats = [
    { number: "85%", label: "Faster Hiring", icon: <Clock className="w-8 h-8" /> },
    { number: "92%", label: "Accuracy Rate", icon: <Target className="w-8 h-8" /> },
    { number: "500+", label: "Companies Trust Us", icon: <Users className="w-8 h-8" /> },
    { number: "50K+", label: "Interviews Conducted", icon: <BarChart3 className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
       <Helmet>
        <title>AuraSync | AI-Powered Hiring Platform</title>
        <meta name="description" content="AuraSync is an AI-powered hiring platform that synchronizes candidate potential with interviewer wisdom. Faster hiring, real-time insights, and intelligent assessments." />
        <meta name="keywords" content="
          AI hiring, AI recruitment, AI interviews, intelligent assessment, adaptive questioning, real-time dashboard,
          resume parsing, candidate evaluation, hiring automation, machine learning recruitment, AI-powered interview,
          deep learning hiring, adaptive AI interviews, recruitment analytics, real-time sync interviews, interview automation,
          AI candidate matching, automated resume screening, HR tech, recruitment technology, talent acquisition AI,
          data-driven hiring, recruitment innovation, AI hiring platform, automated hiring solutions, recruitment efficiency,
          candidate experience, AI recruitment software, predictive hiring analytics, AI-driven talent search, interview insights,
          hiring optimization, recruitment process automation, interview scoring AI, smart candidate evaluation, intelligent hiring software,
          AI hiring assistant, talent intelligence, future of hiring, automated job interviews, hiring technology trends,
          AI-powered HR tools, recruitment digital transformation, automated assessment platform, AI interview scoring, AI interview evaluation,
          interview AI assistant, hiring analytics dashboard, next-gen recruitment platform, intelligent hiring system, interview automation tools
        " />
      </Helmet>
      {/* Navigation - Apple Style */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-11">
            <div className="flex-shrink-0">
              <h1 className="text-xl marck-script-regular font-medium text-gray-900">
                AuraSync
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {['Home', 'About', 'Services', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-6 py-4 space-y-3">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Apple Style */}
      <section id="home" className="pt-24 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-tight">
            The Future of Hiring<br />
            is <span className="text-blue-600 marck-script-regular">Synchronized</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AuraSync Interview: Where AI conducts the interview, and humans gain insight. 
            Seamlessly connect candidate potential with interviewer wisdom in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Experience the Demo
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
              <Github className="w-4 h-4" />
              View GitHub Repo
            </button>
          </div>

          {/* Interactive Demo Preview - Apple Style */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-16">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                      AI
                    </div>
                    <span className="text-sm text-gray-600">Interviewee View</span>
                  </div>
                  <p className="text-gray-900 mb-3">Tell me about your React experience</p>
                  <p className="text-blue-600 text-sm font-medium">05:30 remaining</p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                      D
                    </div>
                    <span className="text-sm text-gray-600">Interviewer Dashboard</span>
                  </div>
                  <p className="text-gray-900 mb-3">Score: 85/100</p>
                  <p className="text-purple-600 text-sm font-medium">Real-time sync</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live synchronization active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Apple Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Apple Style */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
              About <span className="text-blue-600">AuraSync</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AuraSync Interview revolutionizes hiring with AI-powered intelligence. Our platform synchronizes 
              candidate potential with interviewer wisdom through seamless real-time collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-blue-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* AI Visualization - Apple Style */}
          <div className="text-center">
            <div className="inline-flex items-center gap-8 bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Neural Processing</span>
              </div>
              <ArrowRight className="text-gray-400" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">AI Recognition</span>
              </div>
              <ArrowRight className="text-gray-400" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Deep Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Apple Style */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-powered interview solutions for modern hiring teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto">
              Explore All Features
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Apple Style */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trusted by leading companies worldwide
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-900 mb-8 font-medium leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div>
                <div className="font-semibold text-lg text-gray-900">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                <div className="text-blue-600 font-medium">{testimonials[currentTestimonial].company}</div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Apple Style */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ready to transform your hiring process? Get in touch with our team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-sm font-medium transition-all duration-200"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">hello@aurasync.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              {/* Mobile Interface Preview */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📱</span>
                  Mobile Interface
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-sm">Smart Controls</span>
                    <span className="text-blue-600 text-sm font-medium">iOS Integration</span>
                  </div>
                  <div className="w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Apple Style */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                AuraSync
              </h3>
              <p className="text-gray-600 mb-6 max-w-md text-sm leading-relaxed">
                AI-powered interview platform that synchronizes candidate potential with interviewer wisdom in real-time.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Services', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">&copy; 2024 AuraSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;