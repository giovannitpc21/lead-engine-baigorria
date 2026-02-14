import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Home, Building2, GraduationCap } from 'lucide-react';
import { CONTACTOS } from '@/lib/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#c9a962]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#c9a962] rounded flex items-center justify-center">
                <Home className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <span className="text-white font-bold">Grupo Baigorria</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Líderes en real estate en Gran Mendoza. Más de 30 años de experiencia 
              ayudando a familias a encontrar su hogar.
            </p>
            <div className="flex items-center gap-2 text-[#c9a962]">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Century 21 · APROAM · CCB</span>
            </div>
          </div>

          {/* Century 21 */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#c9a962] rounded-full" />
              Century 21 Baigorria
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${CONTACTOS.c21.telefono}`}
                  className="text-gray-400 hover:text-[#c9a962] text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {CONTACTOS.c21.telefono}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${CONTACTOS.c21.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#c9a962] text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTOS.c21.email}`}
                  className="text-gray-400 hover:text-[#c9a962] text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {CONTACTOS.c21.email}
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {CONTACTOS.c21.direccion}
              </li>
            </ul>
          </div>

          {/* APROAM */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#2d4a3e] rounded-full" />
              APROAM
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Administración de Propiedades Altos de Mendoza
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${CONTACTOS.aproam.telefono}`}
                  className="text-gray-400 hover:text-[#c9a962] text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {CONTACTOS.aproam.telefono}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${CONTACTOS.aproam.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#c9a962] text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTOS.aproam.email}`}
                  className="text-gray-400 hover:text-[#c9a962] text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {CONTACTOS.aproam.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#c9a962]" />
              Links útiles
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vender" className="text-gray-400 hover:text-[#c9a962] text-sm">
                  Vender mi propiedad
                </Link>
              </li>
              <li>
                <Link to="/tasador" className="text-gray-400 hover:text-[#c9a962] text-sm">
                  Tasación online
                </Link>
              </li>
              <li>
                <Link to="/trabaja-con-nosotros" className="text-gray-400 hover:text-[#c9a962] text-sm">
                  Trabajá con nosotros
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-[#c9a962] text-sm">
                  Acceso admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Grupo Baigorria. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/privacidad" className="text-gray-500 hover:text-[#c9a962]">
              Política de privacidad
            </Link>
            <Link to="/terminos" className="text-gray-500 hover:text-[#c9a962]">
              Términos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
