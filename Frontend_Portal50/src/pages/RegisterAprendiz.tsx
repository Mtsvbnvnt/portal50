import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getApiUrl } from '../config/api';

function RegisterAprendiz() {
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
    pais: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        throw new Error('Todos los campos son obligatorios');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      console.log('🔄 Iniciando registro de aprendiz...');
      
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      console.log('✅ Usuario Firebase creado:', firebaseUser.uid);

      // Crear FormData para envío multipart
      const userData = new FormData();
      userData.append('uid', firebaseUser.uid);
      userData.append('email', formData.email);
      userData.append('nombre', `${formData.nombre} ${formData.apellido}`);
      userData.append('telefono', formData.telefono);
      userData.append('pais', formData.pais);
      userData.append('rol', 'aprendiz');

      console.log('🔄 Enviando datos al backend...');
      const apiUrl = getApiUrl('/api/users');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: userData
      });

      console.log('📡 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
      }

      const responseData = await response.json();
      console.log('✅ Usuario guardado en BD:', responseData);

      setSuccess('¡Registro exitoso! Redirigiendo...');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/', { state: { success: true } });
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
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Registro de Aprendiz
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Únete a nuestra plataforma de aprendizaje
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
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
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
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
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
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
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
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition duration-200"
              />
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País *
              </label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                placeholder="Chile"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition duration-200"
              />
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
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition duration-200"
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 
                       hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg
                       transition duration-200 transform hover:scale-105 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Registrando...' : 'Registrar Aprendiz'}
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium"
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

export default RegisterAprendiz;