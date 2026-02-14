import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Home } from '@/pages/Home';
import { Vender } from '@/pages/Vender';
import { Comprar } from '@/pages/Comprar';
import { Alquilar } from '@/pages/Alquilar';
import { Contacto } from '@/pages/Contacto';
import { TrabajaConNosotros } from '@/pages/TrabajaConNosotros';
import { Tasador } from '@/pages/Tasador';
import { Propiedades } from '@/pages/Propiedades';
import { PropiedadDetail } from '@/pages/PropiedadDetail';
import { Admin } from '@/pages/Admin';

// Páginas SEO Landing
import TasacionOnlineMendoza from '@/pages/TasacionOnlineMendoza';
import VenderCasaMendoza from '@/pages/VenderCasaMendoza';
import CasasVentaGranMendoza from '@/pages/CasasVentaGranMendoza';
import AdministracionAlquileresMendoza from '@/pages/AdministracionAlquileresMendoza';

// Layout para páginas públicas
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin - sin layout público */}
          <Route path="/admin" element={<Admin />} />

          {/* Páginas públicas */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/vender"
            element={
              <PublicLayout>
                <Vender />
              </PublicLayout>
            }
          />
          <Route
            path="/comprar"
            element={
              <PublicLayout>
                <Comprar />
              </PublicLayout>
            }
          />
          <Route
            path="/alquilar"
            element={
              <PublicLayout>
                <Alquilar />
              </PublicLayout>
            }
          />
          <Route
            path="/contacto"
            element={
              <PublicLayout>
                <Contacto />
              </PublicLayout>
            }
          />
          <Route
            path="/trabaja-con-nosotros"
            element={
              <PublicLayout>
                <TrabajaConNosotros />
              </PublicLayout>
            }
          />
          <Route
            path="/tasador"
            element={
              <PublicLayout>
                <Tasador />
              </PublicLayout>
            }
          />
          <Route
            path="/propiedades"
            element={
              <PublicLayout>
                <Propiedades />
              </PublicLayout>
            }
          />
          <Route
            path="/propiedad/:id"
            element={
              <PublicLayout>
                <PropiedadDetail />
              </PublicLayout>
            }
          />

          {/* Páginas SEO Landing */}
          <Route
            path="/tasacion-online-mendoza"
            element={
              <PublicLayout>
                <TasacionOnlineMendoza />
              </PublicLayout>
            }
          />
          <Route
            path="/vender-casa-mendoza"
            element={
              <PublicLayout>
                <VenderCasaMendoza />
              </PublicLayout>
            }
          />
          <Route
            path="/casas-venta-gran-mendoza"
            element={
              <PublicLayout>
                <CasasVentaGranMendoza />
              </PublicLayout>
            }
          />
          <Route
            path="/administracion-alquileres-mendoza"
            element={
              <PublicLayout>
                <AdministracionAlquileresMendoza />
              </PublicLayout>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;