'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Bug, Search, ShieldCheck, FlaskConical, 
  Leaf, Microscope, Pill, BookOpen, 
  Sprout, CheckSquare, FileText, BarChart, 
  Rocket, Award, ArrowUp, Menu, X, Wheat 
} from "lucide-react";

const STATS = [
  { value: "12+",  label: "Penyakit Padi",          icon: Bug, color: "#dc2626", bg: "#fef2f2"  },
  { value: "30+",  label: "Gejala Teridentifikasi",  icon: Search, color: "#2563eb", bg: "#eff6ff"  },
  { value: "100%", label: "Berbasis Pakar",           icon: ShieldCheck, color: "#7c3aed", bg: "#f5f3ff"  },
  { value: "CF",   label: "Certainty Factor",         icon: FlaskConical, color: "#0d9488", bg: "#f0fdfa"  },
];

const FEATURES = [
  {
    icon: Leaf,
    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",
    title: "Diagnosa Berbasis Fase",
    desc: "Sesuaikan diagnosa dengan fase vegetatif (0–45 hari) atau generatif (45+ hari) tanaman padi Anda untuk hasil akurat.",
  },
  {
    icon: Microscope,
    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",
    title: "Metode Certainty Factor",
    desc: "Menggunakan algoritma CF yang diadaptasi dari pengetahuan pakar BBPOPT Jatisari untuk mengukur tingkat keyakinan.",
  },
  {
    icon: Pill,
    color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    title: "Rekomendasi Penanganan",
    desc: "Dapatkan panduan lengkap mulai dari pestisida, teknik pengendalian, hingga cara budidaya yang tepat.",
  },
  {
    icon: BookOpen,
    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
    title: "Ensiklopedi Penyakit",
    desc: "Akses database lengkap deskripsi penyakit, penyebab, dampak, dan gejala-gejala yang dikenali oleh sistem.",
  },
];

const STEPS = [
  { num: "1", icon: Sprout, title: "Pilih Fase", desc: "Tentukan apakah tanaman Anda di fase vegetatif atau generatif" },
  { num: "2", icon: Wheat, title: "Pilih Bagian", desc: "Pilih bagian tanaman yang menunjukkan gejala spesifik" },
  { num: "3", icon: CheckSquare, title: "Pilih Gejala", desc: "Centang semua gejala yang terlihat dan atur tingkat keyakinan Anda" },
  { num: "4", icon: FileText, title: "Terima Hasil", desc: "Sistem akan mengidentifikasi penyakit beserta rekomendasi lengkap" },
];

const SOURCES = [
  { name: "BBPOPT Jatisari", short: "BBPOPT", url: "https://bbpopt.id" },
  { name: "IRRI", short: "IRRI", url: "https://www.irri.org" },
  { name: "Balitpa", short: "Balitpa", url: "https://bbpadi.litbang.pertanian.go.id" },
  { name: "Kementan RI", short: "Kementan", url: "https://www.pertanian.go.id" },
];

const MENU_ITEMS = [
  { label: "Beranda", icon: Wheat, section: "hero" },
  { label: "Statistik", icon: BarChart, section: "statistics" },
  { label: "Cara Kerja", icon: Rocket, section: "how-it-works" },
  { label: "Keunggulan", icon: Award, section: "features" },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Muncul setelah scroll melewati 1 layar awal (height dari viewport)
      if (window.scrollY > window.innerHeight) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">

      {/* ───────────────────────────────────────────────────
          NAVBAR
      ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b bg-white/90 border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 text-white">
              <Wheat size={18} />
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">
              Pakar<span className="text-green-600">Pari.id</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {MENU_ITEMS.slice(1).map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.section)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <Link href="/diagnose">
              <button className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm">
                Mulai Diagnosa
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Buka menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ───────────────────────────────────────────────────
          MOBILE DRAWER (50% Width, Right Side)
      ─────────────────────────────────────────────────── */}
      {/* Overlay Background */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-1/2 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="font-bold text-gray-800 text-sm">Menu</span>
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="p-1 rounded-md text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-2 flex-grow">
          {MENU_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.section)}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <item.icon size={18} className="text-gray-500" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link href="/diagnose">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
            >
              Diagnosa Sekarang
            </button>
          </Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────
          HERO SECTION
      ─────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20">
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border bg-green-50 text-green-700 border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistem Pakar Padi Indonesia
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Deteksi Penyakit Padi <br className="hidden sm:block" />
            <span className="text-green-600">Lebih Cepat,</span> Tepat & Akurat
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-10 px-2">
            Sistem pakar profesional berbasis <strong className="text-gray-800">Certainty Factor</strong> yang membantu petani mengidentifikasi penyakit tanaman padi secara mandiri berdasarkan referensi pakar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2">
            <Link href="/diagnose" className="w-full sm:w-auto">
              <button className="group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white text-base bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-600/30 transition-all w-full">
                <Microscope size={20} />
                Mulai Diagnosa
              </button>
            </Link>
            <Link href="/diseases" className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-gray-700 text-base bg-white border-2 border-gray-200 hover:border-green-600 hover:text-green-700 transition-all w-full">
                <BookOpen size={20} />
                Ensiklopedi Penyakit
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────
          STATS CARDS
      ─────────────────────────────────────────────────── */}
      <section id="statistics" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(stat => (
            <div key={stat.label} className="rounded-2xl p-6 border transition-all hover:shadow-md bg-white" style={{ borderColor: stat.color + "30" }}>
              <div className="mb-4 inline-flex p-3 rounded-lg" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={28} />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────
          CARA KERJA
      ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-2">Cara Kerja</p>
            <h2 className="text-3xl font-extrabold text-gray-900">4 Langkah Mudah Diagnosa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(s => (
              <div key={s.num} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold shadow-lg">
                  {s.num}
                </div>
                <div className="text-green-600 mb-4 mt-2">
                  <s.icon size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────
          KEUNGGULAN
      ─────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-2">Keunggulan Sistem</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Mengapa PakarPari.id?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all bg-gray-50 hover:bg-white group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white shadow-sm group-hover:scale-110 transition-transform" style={{ color: f.color }}>
                  <f.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────
          FOOTER & SOURCES
      ─────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {SOURCES.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:text-green-700 hover:border-green-200 transition-colors">
                {s.name}
              </a>
            ))}
          </div>
          <div className="w-16 h-px bg-gray-200"></div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PakarPari.id. Sistem Pakar Penyakit Padi.
          </p>
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────
          BACK TO TOP BUTTON
      ─────────────────────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 hover:-translate-y-1 transition-all duration-300 z-40 ${
          showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-label="Kembali ke atas"
      >
        <ArrowUp size={24} strokeWidth={2.5} />
      </button>

    </main>
  );
}