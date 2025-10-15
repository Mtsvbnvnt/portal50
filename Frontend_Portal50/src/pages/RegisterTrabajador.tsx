import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getApiUrl } from '../config/api';

export default function RegisterTrabajador() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    pais: 'Chile',
    password: '',
    habilidades: '',
    experienciaLaboral: '',
    nivelEducacion: '',
    institucionEducativa: '',
    carrera: '',
    añoGraduacion: '',
    descripcionPersonal: '',
    preferenciaModalidad: 'no tengo preferencia'
  });

  // Estados para archivos
  const [cv, setCv] = useState<File | null>(null);
  const [videoPresentacion, setVideoPresentacion] = useState<File | null>(null);
  const [noTieneCv, setNoTieneCv] = useState(false);
  
  // Estado para mostrar/ocultar sección de educación
  const [mostrarEducacion, setMostrarEducacion] = useState(false);

  // Estado para modalidades de trabajo (selección múltiple)
  const [modalidadesTrabajo, setModalidadesTrabajo] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModalidadChange = (modalidad: string) => {
    setModalidadesTrabajo(prev => {
      if (prev.includes(modalidad)) {
        return prev.filter(m => m !== modalidad);
      } else {
        return [...prev, modalidad];
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'cv') {
        setCv(file);
      } else {
        setVideoPresentacion(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.apellido || !formData.email || 
          !formData.telefono || !formData.pais || !formData.password) {
        throw new Error('Los campos básicos son obligatorios');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      console.log("🔄 Iniciando registro de trabajador...");
      
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      
      console.log("✅ Usuario Firebase creado:", firebaseUser.uid);

      // Preparar FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('uid', firebaseUser.uid);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellido', formData.apellido);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('pais', formData.pais);
      formDataToSend.append('rol', 'profesional');
      formDataToSend.append('habilidades', formData.habilidades);
      formDataToSend.append('experienciaLaboral', formData.experienciaLaboral);
      formDataToSend.append('descripcionPersonal', formData.descripcionPersonal);
      formDataToSend.append('preferenciaModalidad', formData.preferenciaModalidad);
      
      // Agregar modalidades de trabajo
      formDataToSend.append('modalidadesTrabajo', JSON.stringify(modalidadesTrabajo));
      
      // Agregar educación como JSON solo si la sección está visible y tiene datos
      const educacion = [];
      if (mostrarEducacion && (formData.nivelEducacion || formData.institucionEducativa || formData.carrera || formData.añoGraduacion)) {
        educacion.push({
          nivel: formData.nivelEducacion,
          institucion: formData.institucionEducativa,
          carrera: formData.carrera,
          año: formData.añoGraduacion
        });
      }
      formDataToSend.append('educacion', JSON.stringify(educacion));

      // Agregar archivos si existen
      if (cv && !noTieneCv) {
        formDataToSend.append('cv', cv);
      }
      if (videoPresentacion) {
        formDataToSend.append('videoPresentacion', videoPresentacion);
      }

      console.log("🔄 Enviando datos al backend...");
      const apiUrl = getApiUrl("/api/users");
      console.log("📡 URL de API:", apiUrl);

      // Crear usuario en MongoDB
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log("📡 Respuesta del servidor:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ Error del servidor:", errorData);
        throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
      }

      const responseData = await response.json();
      console.log("✅ Usuario guardado en BD:", responseData);

      setSuccess('¡Registro exitoso! Redirigiendo al dashboard...');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard', { state: { success: true } });
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error completo:', error);
      setError(error.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Registro de Profesional
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Crea tu perfil profesional para encontrar oportunidades laborales
            </p>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Tu nombre"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Tu apellido"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+56 9 1234 5678"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  />
                </div>

                {/* País */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    País *
                  </label>
                  <select
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  >
                    <option value="Chile">Chile</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="España">España</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="México">México</option>
                    <option value="Perú">Perú</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Panamá">Panamá</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Canadá">Canadá</option>
                    <option value="Francia">Francia</option>
                    <option value="Italia">Italia</option>
                    <option value="Alemania">Alemania</option>
                    <option value="Reino Unido">Reino Unido</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información Profesional
              </h3>

              {/* Habilidades */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Habilidades Técnicas
                </label>
                <input
                  type="text"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleInputChange}
                  placeholder="React, JavaScript, Python, etc. (separadas por comas)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                />
              </div>

              {/* Experiencia Laboral */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experiencia Laboral
                </label>
                <textarea
                  name="experienciaLaboral"
                  value={formData.experienciaLaboral}
                  onChange={handleInputChange}
                  placeholder="Describe tu experiencia laboral más relevante..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                />
              </div>

              {/* Descripción Personal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción Personal
                </label>
                <textarea
                  name="descripcionPersonal"
                  value={formData.descripcionPersonal}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre ti, tus objetivos profesionales, etc..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                />
              </div>
            </div>

            {/* ¿Quieres trabajar? (Modalidades) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ¿Quieres trabajar?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selecciona todas las modalidades de trabajo que te interesan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'tiempo-completo', label: 'Tiempo completo', description: 'Trabajo de 40+ horas semanales' },
                  { id: 'part-time', label: 'Part time', description: 'Trabajo de tiempo parcial' },
                  { id: 'por-proyectos', label: 'Por proyectos', description: 'Proyectos específicos con duración definida' },
                  { id: 'consultoria', label: 'Consultoría', description: 'Asesoría especializada y estratégica' },
                  { id: 'mentoria', label: 'Mentoría', description: 'Guía y desarrollo de otros profesionales' }
                ].map((modalidad) => (
                  <div
                    key={modalidad.id}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      modalidadesTrabajo.includes(modalidad.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                    }`}
                    onClick={() => handleModalidadChange(modalidad.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 border-2 rounded flex-shrink-0 mt-0.5 transition-colors ${
                        modalidadesTrabajo.includes(modalidad.id)
                          ? 'border-purple-500 bg-purple-500 dark:border-purple-400 dark:bg-purple-400'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {modalidadesTrabajo.includes(modalidad.id) && (
                          <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {modalidad.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {modalidad.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {modalidadesTrabajo.length > 0 && (
                <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-purple-800 dark:text-purple-200">
                      Modalidades seleccionadas:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {modalidadesTrabajo.map((modalidad) => {
                      const modalidadData = [
                        { id: 'tiempo-completo', label: 'Tiempo completo' },
                        { id: 'part-time', label: 'Part time' },
                        { id: 'por-proyectos', label: 'Por proyectos' },
                        { id: 'consultoria', label: 'Consultoría' },
                        { id: 'mentoria', label: 'Mentoría' }
                      ].find(m => m.id === modalidad);
                      
                      return (
                        <span
                          key={modalidad}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                        >
                          {modalidadData?.label}
                          <button
                            type="button"
                            onClick={() => handleModalidadChange(modalidad)}
                            className="ml-1 hover:bg-purple-700 rounded-full p-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Preferencia de modalidad (Remoto/Presencial) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ¿Prefieres trabajar?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selecciona tu preferencia de modalidad de trabajo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'remoto', label: 'Remoto', description: 'Trabajo completamente a distancia', icon: '🏠' },
                  { value: 'presencial', label: 'Presencial', description: 'Trabajo en oficina o lugar físico', icon: '🏢' },
                  { value: 'no tengo preferencia', label: 'No tengo preferencia', description: 'Abierto a cualquier modalidad', icon: '🤝' }
                ].map((opcion) => (
                  <div
                    key={opcion.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.preferenciaModalidad === opcion.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                    }`}
                    onClick={() => setFormData({...formData, preferenciaModalidad: opcion.value})}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 border-2 rounded-full flex-shrink-0 mt-0.5 transition-colors ${
                        formData.preferenciaModalidad === opcion.value
                          ? 'border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {formData.preferenciaModalidad === opcion.value && (
                          <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{opcion.icon}</span>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {opcion.label}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {opcion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Preferencia seleccionada: {
                      formData.preferenciaModalidad === 'remoto' ? '🏠 Remoto' :
                      formData.preferenciaModalidad === 'presencial' ? '🏢 Presencial' :
                      '🤝 No tengo preferencia'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Educación (Opcional) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Educación (Opcional)
                </h3>
                {!mostrarEducacion ? (
                  <button
                    type="button"
                    onClick={() => setMostrarEducacion(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 
                             hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                             border border-blue-200 hover:border-blue-300 dark:border-blue-600 
                             dark:hover:border-blue-500 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Educación
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMostrarEducacion(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 
                             hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                             border border-red-200 hover:border-red-300 dark:border-red-600 
                             dark:hover:border-red-500 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Quitar Educación
                  </button>
                )}
              </div>

              {mostrarEducacion && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nivel de Educación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nivel de Educación
                      </label>
                      <select
                        name="nivelEducacion"
                        value={formData.nivelEducacion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition duration-200"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="secundaria">Educación Secundaria</option>
                        <option value="tecnico">Técnico</option>
                        <option value="universitario">Universitario</option>
                        <option value="posgrado">Posgrado</option>
                      </select>
                    </div>

                    {/* Institución */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Institución Educativa
                      </label>
                      <input
                        type="text"
                        name="institucionEducativa"
                        value={formData.institucionEducativa}
                        onChange={handleInputChange}
                        placeholder="Universidad, Instituto, etc."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition duration-200"
                      />
                    </div>

                    {/* Carrera */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Carrera/Especialidad
                      </label>
                      <input
                        type="text"
                        name="carrera"
                        value={formData.carrera}
                        onChange={handleInputChange}
                        placeholder="Ingeniería, Administración, etc."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition duration-200"
                      />
                    </div>

                    {/* Año de Graduación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Año de Graduación
                      </label>
                      <input
                        type="number"
                        name="añoGraduacion"
                        value={formData.añoGraduacion}
                        onChange={handleInputChange}
                        placeholder="2023"
                        min="1950"
                        max="2030"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 <strong>Tip:</strong> Agregar información educativa puede mejorar significativamente tu perfil profesional.
                    </p>
                  </div>
                </div>
              )}

              {!mostrarEducacion && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    La información educativa es opcional pero recomendada para mejorar tu perfil.
                  </p>
                </div>
              )}
            </div>

            {/* Documentos (Opcional) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentos (Opcional)
              </h3>

              {/* Curriculum Vitae */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Curriculum Vitae (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'cv')}
                  disabled={noTieneCv}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200 disabled:opacity-50"
                />
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={noTieneCv}
                      onChange={(e) => setNoTieneCv(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      No tengo CV disponible
                    </span>
                  </label>
                </div>
              </div>

              {/* Video de Presentación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video de Presentación (MP4, máx. 50MB)
                </label>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Un video corto donde te presentes profesionalmente (recomendado)
                </p>
              </div>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 
                       hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg
                       transition duration-200 transform hover:scale-105 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Registrando...' : 'Registrar Profesional'}
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}