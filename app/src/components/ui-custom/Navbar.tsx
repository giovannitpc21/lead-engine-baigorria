import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS, CONTACTOS } from '@/lib/constants';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#c9a962]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c9a962] rounded flex items-center justify-center">
              <Home className="w-5 h-5 text-[#1a1a1a]" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-tight">Grupo Baigorria</span>
              <span className="text-[#c9a962] text-xs">Century 21 · APROAM · CCB</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#c9a962] bg-[#c9a962]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${CONTACTOS.c21.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#c9a962] hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">{CONTACTOS.c21.telefono}</span>
            </a>
            <Button
              asChild
              className="bg-[#c9a962] hover:bg-[#b8984f] text-black font-semibold"
            >
              <Link to="/tasador">Tasá gratis</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#c9a962]/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'text-[#c9a962] bg-[#c9a962]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-700">
              <a
                href={`https://wa.me/${CONTACTOS.c21.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-[#c9a962]"
              >
                <Phone className="w-4 h-4" />
                <span>{CONTACTOS.c21.telefono}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
