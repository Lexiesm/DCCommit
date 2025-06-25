'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { FaBars, FaTimes } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

const menuItems = [
    { label: 'Mi perfil', href: '/edit-profile' },
    { label: 'Mis posts', href: '/my-posts' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Moderar', href: '/moderator' },
    { label: 'About', href: '/about' }
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const role = user?.publicMetadata?.role;

  const menuItems = [
    { label: 'Mi perfil', href: '/edit-profile' },
    { label: 'Mis posts', href: '/my-posts' },
    ...(role === 'ADMIN' ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(role === 'MODERATOR' ? [{ label: 'Moderar', href: '/moderator' }] : []),
    { label: 'About', href: '/about' }
  ];

  return (
    <div className="relative z-50">
      <button
        className="p-2 text-2xl focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay para cerrar el menú al hacer click fuera */}
            <div
              className="fixed inset-0 z-40 bg-black/10 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed top-4 right-4 w-56 rounded-xl h-auto bg-slate-900 shadow-lg flex flex-col p-4 gap-4 border border-gray-200 z-50"
              style={{ maxWidth: '90vw' }}
            >
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
