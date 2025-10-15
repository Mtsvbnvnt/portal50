// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminFraccional from "./pages/AdminFraccional";
import EmpresaDetalle from "./pages/EmpresaDetalle";
import EjecutivoPanel from "./pages/EjecutivoPanel";
import SolicitudEmpleoDetalle from "./pages/SolicitudEmpleoDetalle";
import CrearSolicitudEmpleo from "./pages/CrearSolicitudEmpleo";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import RegisterSelector from "./pages/RegisterSelector";
import RegisterEmpresa from "./pages/RegisterEmpresa";
import RegisterUsuario from "./pages/RegisterUsuario";
import RegisterTrabajador from "./pages/RegisterTrabajador";
import RegisterAprendiz from "./pages/RegisterAprendiz";
import Configuracion from "./pages/Configuracion";
import QuieroContratar from "./pages/Quierocontratar";
import EmpresaPanel from "./pages/EmpresaPanel";
import PublicarOferta from "./pages/PublicarOferta";
import EmpresaPostulantes from "./pages/EmpresaPostulantes";
import Trabajar from "./pages/Trabajar";
import PostularOferta from "./pages/PostularOferta";
import EditarOferta from "./pages/EditarOferta";
import Trabajadores from "./pages/Trabajadores";
import CompletarPerfil from "./pages/CompletarPerfil";
import CompletarCV from "./pages/CompletarCV";
import PerfilTrabajador from "./pages/PerfilTrabajador";
import Aprender from "./pages/Aprender";
import CursoDetalle from "./pages/CursoDetalle";
import SubirCurso from "./pages/SubirCurso";
import { AuthGuard } from "./router/guards/AuthGuard";
import { AdminAuthGuard } from "./router/guards/AdminAuthGuard";


export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
             <Route path="/register" element={<RegisterSelector />} />
             <Route path="/register-empresa" element={<RegisterEmpresa />} />
             <Route path="/register-usuario" element={<RegisterUsuario />} />
             <Route path="/register-trabajador" element={<RegisterTrabajador />} />
             <Route path="/register-aprendiz" element={<RegisterAprendiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/dashboard" element={
              <AuthGuard requiredRoles={['profesional', 'profesional-ejecutivo']}>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/configuracion" element={
              <AuthGuard>
                <Configuracion />
              </AuthGuard>
            } />
            <Route path="/empresa" element={
              <AuthGuard requiredRoles={['empresa', 'ejecutivo']}>
                <EmpresaPanel />
              </AuthGuard>
            } />
            <Route path="/ejecutivo" element={
              <AdminAuthGuard requiredRoles={['ejecutivo']}>
                <EjecutivoPanel />
              </AdminAuthGuard>
            } />
            <Route path="/solicitud-empleo/:id" element={
              <AdminAuthGuard requiredRoles={['ejecutivo']}>
                <SolicitudEmpleoDetalle />
              </AdminAuthGuard>
            } />
            <Route path="/empresa/crear-solicitud" element={
              <AuthGuard requiredRoles={['empresa']}>
                <CrearSolicitudEmpleo />
              </AuthGuard>
            } />
            <Route path="/quiero-contratar" element={<QuieroContratar />} />
            <Route path="/publicar-oferta" element={
              <AuthGuard requiredRoles={['empresa', 'ejecutivo']}>
                <PublicarOferta />
              </AuthGuard>
            } />
            <Route path="/postular-oferta/:jobId" element={
              <AuthGuard requiredRoles={['profesional', 'profesional-ejecutivo']}>
                <PostularOferta />
              </AuthGuard>
            } />
            <Route path="/trabajar" element={<Trabajar />} />
            <Route path="/completar-perfil" element={
              <AuthGuard>
                <CompletarPerfil />
              </AuthGuard>
            } />
            <Route path="/completar-cv" element={
              <AuthGuard requiredRoles={['profesional', 'profesional-ejecutivo']}>
                <CompletarCV />
              </AuthGuard>
            } />
            <Route path="/quiero-contratar/trabajadores" element={
              <AuthGuard requiredRoles={['empresa', 'ejecutivo']}>
                <Trabajadores />
              </AuthGuard>
            } />
            <Route path="/empresa/postulantes/:jobId" element={
              <AuthGuard requiredRoles={['empresa', 'ejecutivo']}>
                <EmpresaPostulantes />
              </AuthGuard>
            } />
            <Route path="/perfil-trabajador/:id" element={<PerfilTrabajador />} />
            <Route path="/editar-oferta/:jobId" element={
              <AuthGuard requiredRoles={['empresa', 'ejecutivo']}>
                <EditarOferta />
              </AuthGuard>
            } />
            <Route path="/aprender" element={<Aprender />} />
            <Route path="/subir-curso" element={
              <AuthGuard>
                <SubirCurso />
              </AuthGuard>
            } />
            <Route path="/aprender/curso/:id" element={<CursoDetalle />} />
            <Route path="/admin-fraccional" element={
              <AdminAuthGuard requiredRoles={['admin-fraccional']}>
                <AdminFraccional />
              </AdminAuthGuard>
            } />
            <Route path="/admin-fraccional/empresa/:empresaId" element={
              <AdminAuthGuard requiredRoles={['admin-fraccional']}>
                <EmpresaDetalle />
              </AdminAuthGuard>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
