import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getApiUrl } from '../config/api';

function RegisterEmpresa() {
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
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          !formData.telefono || !formData.pais || !formData.password || !formData.confirmPassword) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (!formData.email.includes('@')) {
        throw new Error('El correo debe tener un formato válido');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      console.log('🔄 Iniciando registro de empresa...');
      
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      console.log('✅ Usuario creado en Firebase:', user.uid);

      // Obtener token de Firebase
      const idToken = await user.getIdToken();
      console.log('🔑 Token obtenido');

      // Crear empresa en MongoDB
      const apiUrl = getApiUrl('/api/empresas');
      console.log('🌐 Enviando datos al backend:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: formData.email,
          nombre: `${formData.nombre} ${formData.apellido}`,
          telefono: formData.telefono,
          rol: 'empresa',
          direccion: formData.pais,
          videoPresentacion: '',
          ejecutivos: []
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Empresa creada exitosamente:', result);

      setSuccess('¡Registro exitoso! Redirigiendo...');
      
      setTimeout(() => {
        navigate('/', { state: { success: true } });
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      setError(error.message || 'Error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Registro de Empresa
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Únete a nuestra plataforma empresarial
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="+56 9 1234 5678"
                required
              />
            </div>

            {/* País */}
            <div>
              <label htmlFor="pais" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País *
              </label>
              <select
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                required
              >
                <option value="">Selecciona tu país</option>
                <option value="Chile">Chile</option>
                <option value="Argentina">Argentina</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Brasil">Brasil</option>
                <option value="Colombia">Colombia</option>
                <option value="Ecuador">Ecuador</option>
                <option value="México">México</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Perú">Perú</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {loading ? 'Registrando...' : 'Registrar Empresa'}
            </button>

            {/* Mensajes de error y éxito */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
          </form>

          {/* Link de navegación */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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

export default RegisterEmpresa;
