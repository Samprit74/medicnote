import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  FileText,
  Calendar,
  ArrowRight,
  Moon,
  Sun,
  Shield,
  Clock,
  Stethoscope,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Zap,
  Heart,
  Star,
  Award
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/30 dark:bg-primary/20 blur-xl animate-pulse"></div>
              <div className="relative rounded-lg bg-primary/20 dark:bg-primary/10 p-2 text-primary shadow-lg shadow-primary/30 dark:shadow-primary/20">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">
              MedicNote
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110 border border-border/50"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex font-medium hover:bg-primary/10 hover:text-primary">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="relative group bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/40 dark:shadow-primary/30 hover:shadow-primary/50 dark:hover:shadow-primary/40 transition-all duration-300">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <section className="relative min-h-screen flex items-center justify-center p-6 lg:p-12 overflow-hidden">
          {/* Hero Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-300/40 dark:from-blue-900/20 via-indigo-300/30 dark:via-indigo-900/20 to-purple-300/30 dark:to-purple-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 dark:from-blue-900/20 to-cyan-300/30 dark:to-cyan-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/30 dark:from-purple-900/20 to-pink-300/30 dark:to-pink-900/20 rounded-full blur-3xl animate-pulse delay-2000" />
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/20 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1500"></div>
          <div className="absolute top-3/4 left-1/3 w-60 h-60 bg-pink-300/20 dark:bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>

          <div className="max-w-5xl w-full text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/20 dark:shadow-none animate-fade-in text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Revolutionizing healthcare management</span>
            </div>

            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
              Healthcare management,{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent block mt-2">
                simplified.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              MedicNote brings doctors and patients together with a modern, intuitive platform.
              Manage appointments, prescriptions, and medical records seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 group relative bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 hover:shadow-3xl hover:shadow-primary/50 transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2">
                    Start for free
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20">
                  <Stethoscope className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform text-primary" />
                  <span>Doctor Portal</span>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/20 dark:shadow-none hover:shadow-xl hover:bg-white/40 transition-all">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full border border-white/50 dark:border-white/10 shadow-lg shadow-emerald-200/20 dark:shadow-none hover:shadow-xl hover:bg-white/40 transition-all">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">10k+ Active Users</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/20 dark:shadow-none hover:shadow-xl hover:bg-white/40 transition-all">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-foreground">24/7 Support</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border border-white/50 dark:border-white/10 flex items-start justify-center p-1 bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-lg shadow-primary/10">
              <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="relative py-20 px-6 bg-transparent overflow-hidden">
          {/* Feature Section Background Gradients - moved lower */}
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-300/20 dark:from-blue-900/10 via-indigo-300/20 dark:via-indigo-900/10 to-purple-300/20 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[30%] left-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-300/20 dark:from-cyan-900/10 to-blue-400/20 dark:to-blue-900/10 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute bottom-[10%] right-0 w-[400px] h-[400px] bg-gradient-to-tl from-pink-300/20 dark:from-pink-900/10 to-purple-400/20 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse delay-1400" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 text-primary text-sm font-medium mb-4 shadow-sm">
                <Heart className="h-4 w-4" />
                <span>Comprehensive Care Tools</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  manage care
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Streamline your practice with powerful tools designed for modern healthcare.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  color: "blue",
                  gradient: "from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-500/10",
                  iconColor: "text-blue-600 dark:text-blue-400",
                  title: "Patient Management",
                  description: "Keep track of your patients' history, appointments, and vitals in one secure place.",
                  features: ["Medical history", "Vital signs", "Treatment plans"]
                },
                {
                  icon: Calendar,
                  color: "emerald",
                  gradient: "from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/10",
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                  title: "Smart Queue",
                  description: "Manage your daily appointments efficiently with our real-time queue system.",
                  features: ["Real-time updates", "Automated reminders", "Wait time estimates"]
                },
                {
                  icon: FileText,
                  color: "violet",
                  gradient: "from-violet-100 to-violet-50 dark:from-violet-500/20 dark:to-violet-500/10",
                  iconColor: "text-violet-600 dark:text-violet-400",
                  title: "Digital Prescriptions",
                  description: "Generate, sign, and send secure digital prescriptions directly to your patients.",
                  features: ["e-Prescriptions", "Digital signatures", "Pharmacy integration"]
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative rounded-3xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-lg p-8 shadow-xl shadow-${feature.color}-200/10 dark:shadow-none hover:shadow-2xl hover:shadow-${feature.color}-300/20 hover:bg-white/80 dark:hover:bg-black/50 transition-all duration-300 hover:-translate-y-2 animate-on-scroll opacity-0 translate-y-10 overflow-hidden`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-50/40 dark:via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2.5">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className={`h-3.5 w-3.5 ${feature.iconColor}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-blue-200/50 dark:border-border flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      <span>Learn more</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Blobs moved lower */}
        <section className="relative py-20 px-6 border-t border-white/20 dark:border-white/10 bg-transparent overflow-hidden">
          {/* Stats Background Gradients - moved 1 inch lower */}
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300/20 dark:from-blue-900/10 via-purple-300/20 dark:via-purple-900/10 to-pink-300/20 dark:to-pink-900/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[5%] right-0 w-[300px] h-[300px] bg-gradient-to-tl from-emerald-300/20 dark:from-emerald-900/10 to-cyan-300/20 dark:to-cyan-900/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "50K+", label: "Active Users", icon: Users, color: "text-blue-600", bgGradient: "from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-500/10" },
                { number: "200K+", label: "Appointments", icon: Calendar, color: "text-emerald-600", bgGradient: "from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/10" },
                { number: "98%", label: "Satisfaction Rate", icon: Star, color: "text-amber-600", bgGradient: "from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/10" },
                { number: "24/7", label: "Support Available", icon: Zap, color: "text-purple-600", bgGradient: "from-purple-100 to-purple-50 dark:from-purple-500/20 dark:to-purple-500/10" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 bg-white/80 dark:bg-black/50 backdrop-blur-lg rounded-3xl p-6 border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/10 dark:shadow-none hover:shadow-xl hover:bg-white/90 dark:hover:bg-black/60 transition-all`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${stat.bgGradient} ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section - Blobs moved lower */}
        <section className="relative py-20 px-6 bg-transparent overflow-hidden">
          {/* Testimonial Background Gradients - moved lower */}
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-indigo-300/20 dark:from-indigo-900/10 via-purple-300/20 dark:via-purple-900/10 to-pink-300/20 dark:to-pink-900/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[20%] left-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-300/20 dark:from-blue-900/10 to-cyan-300/20 dark:to-cyan-900/10 rounded-full blur-3xl animate-pulse delay-800" />
          <div className="absolute bottom-[5%] right-0 w-[300px] h-[300px] bg-gradient-to-tl from-purple-300/20 dark:from-purple-900/10 to-pink-300/20 dark:to-pink-900/10 rounded-full blur-3xl animate-pulse delay-1600" />

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 text-primary text-sm font-medium mb-4 shadow-sm">
                  <Award className="h-4 w-4" />
                  <span>Trusted by professionals</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Why healthcare professionals{" "}
                  <span className="text-primary">love MedicNote</span>
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                  "MedicNote has transformed how I manage my practice. The intuitive interface
                  and powerful features have saved me countless hours."
                </p>
                <div className="flex items-center gap-4 p-4 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/10 dark:shadow-none hover:bg-white/80 transition-all">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Jane Doe</div>
                    <div className="text-sm text-muted-foreground">Family Medicine, NYC</div>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/10 dark:shadow-none hover:shadow-xl hover:bg-white/80 dark:hover:bg-black/50 transition-all">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="font-semibold text-sm">Analytics Dashboard</div>
                      <div className="text-xs text-muted-foreground">Track performance</div>
                    </div>
                    <div className="p-4 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 shadow-lg shadow-emerald-200/10 dark:shadow-none hover:shadow-xl hover:bg-white/80 dark:hover:bg-black/50 transition-all">
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="font-semibold text-sm">Secure Data</div>
                      <div className="text-xs text-muted-foreground">HIPAA compliant</div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="p-4 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 shadow-lg shadow-purple-200/10 dark:shadow-none hover:shadow-xl hover:bg-white/80 dark:hover:bg-black/50 transition-all">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="font-semibold text-sm">Real-time Sync</div>
                      <div className="text-xs text-muted-foreground">Instant updates</div>
                    </div>
                    <div className="p-4 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 shadow-lg shadow-blue-200/10 dark:shadow-none hover:shadow-xl hover:bg-white/80 dark:hover:bg-black/50 transition-all">
                      <div className="text-2xl mb-1">📱</div>
                      <div className="font-semibold text-sm">Mobile Ready</div>
                      <div className="text-xs text-muted-foreground">Access anywhere</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Blobs moved lower */}
        <section className="relative py-20 px-6 overflow-hidden">
          {/* CTA Background Gradients - moved lower */}
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300/30 dark:from-blue-900/15 via-purple-300/30 dark:via-purple-900/15 to-pink-300/30 dark:to-pink-900/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[20%] right-0 w-[300px] h-[300px] bg-gradient-to-bl from-cyan-300/20 dark:from-cyan-900/10 to-blue-400/20 dark:to-blue-900/10 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute bottom-[5%] left-0 w-[300px] h-[300px] bg-gradient-to-tr from-purple-300/20 dark:from-purple-900/10 to-pink-300/20 dark:to-pink-900/10 rounded-full blur-3xl animate-pulse delay-1400" />

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl p-12 border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-none animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent pointer-events-none"></div>
              <div className="absolute top-[30%] right-[30%] w-40 h-40 bg-blue-300/20 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-[20%] left-[30%] w-40 h-40 bg-purple-300/20 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md text-primary text-sm font-medium mb-4 border border-white/50 dark:border-white/10 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Start your journey today</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                  Ready to transform your practice?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                  Join thousands of healthcare professionals who trust MedicNote to streamline their workflow.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button size="lg" className="gap-2 group bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 hover:shadow-3xl hover:shadow-primary/50 transition-all duration-300">
                      <span>Get started today</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20">
                      Sign in
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  No credit card required. Free 14-day trial.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 backdrop-blur-xl py-12 overflow-hidden">
        {/* Footer Background Gradients - moved lower */}
        <div className="absolute bottom-[10%] right-0 w-[400px] h-[400px] bg-gradient-to-tl from-blue-300/10 dark:from-blue-900/5 to-purple-300/10 dark:to-purple-900/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] left-0 w-[300px] h-[300px] bg-gradient-to-br from-pink-300/10 dark:from-pink-900/5 to-indigo-300/10 dark:to-indigo-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-primary shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg text-primary">MedicNote</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern healthcare management for the digital age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 dark:border-white/10 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} MedicNote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;