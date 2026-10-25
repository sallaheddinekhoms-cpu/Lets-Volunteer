"use client"

import React, { useState } from 'react';
import { Menu, X, HeartHandshake, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar({ isAuthenticated, isOrganization }: { isAuthenticated: boolean, isOrganization?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, dir, toggleLanguage, t } = useLanguage();

  const navItems = [
    { title: t('nav.home', 'الرئيسية'), href: '/' },
    { title: t('nav.opportunities', 'الفرص التطوعية'), href: '/opportunities' },
    { title: t('nav.solidarityStore', 'متجر التطوع'), href: '/solidarity-store' },
    { title: t('nav.trainings', 'فضاء التكوين'), href: '/trainings' },
    { title: t('nav.gallery', 'معرض الصور والفيديو'), href: '/gallery' },
    { title: t('nav.accreditation', 'ميثاق الاعتماد'), href: '/accreditation' },
    { title: t('nav.contact', 'اتصل بنا'), href: '/contact' },
  ];

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-3 xl:gap-6">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image 
                src="/logo.svg"
                alt="لنتطوع"
                width={80}
                height={40}
                className="brightness-0 invert"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-3.5">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-white/90 hover:text-white px-1.5 xl:px-2.5 py-2 text-xs xl:text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  {item.title}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#17B2A8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Action Buttons Container */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/10 text-xs font-semibold px-2.5 py-1 rounded-lg gap-1.5"
              title="تغيير لغة العرض / Switch Language"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </Button>

            {isOrganization && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/aids">
                  <Button 
                    className="bg-secondary hover:bg-[#17B2A8]/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                  >
                    {lang === 'ar' ? 'النشاطات' : 'Activities'} <HeartHandshake className="w-4 h-4 mr-1.5" />
                  </Button>
                </Link>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={isAuthenticated ? '/profile' : '/auth'}>
                <Button 
                  className="bg-secondary hover:bg-[#17B2A8]/90 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                >
                  {isAuthenticated ? (lang === 'ar' ? 'حسابي' : 'My Account') : (lang === 'ar' ? 'تسجيل الدخول' : 'Login')}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/10 text-xs px-2 py-1 rounded"
            >
              {lang === 'ar' ? 'EN' : 'عر'}
            </Button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-[#17B2A8]/20 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-base text-start font-medium text-white/90 hover:text-white hover:bg-[#17B2A8]/20 rounded-xl transition-colors duration-200"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    {item.title}
                  </motion.a>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="space-y-2 pt-2">
                  {isOrganization && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Link href="/aids">
                        <Button className="w-full bg-secondary hover:bg-[#17B2A8]/90 text-white px-4 py-2 rounded-xl text-md font-medium transition-all duration-300">
                          {lang === 'ar' ? 'النشاطات الاجتماعية' : 'Social Activities'} <HeartHandshake className="w-6 h-6 mr-2" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                  >
                    <Link href={isAuthenticated ? '/profile' : '/auth'}>
                      <Button className="w-full bg-secondary hover:bg-[#17B2A8]/90 text-white px-4 py-2 rounded-xl text-md font-medium transition-all duration-300">
                        {isAuthenticated ? (lang === 'ar' ? 'حسابي' : 'My Account') : (lang === 'ar' ? 'تسجيل الدخول' : 'Login')}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
