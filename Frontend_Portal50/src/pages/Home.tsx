// src/pages/Home.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(location.state?.success);
  const [showLoginSuccess, setShowLoginSuccess] = useState(location.state?.loginSuccess);
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (location.state?.loginSuccess) {
      setShowLoginSuccess(true);
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-200">
      {/* Barra verde de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ {t('home.success_registration')}
        </div>
      )}
      {showLoginSuccess && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ {t('home.success_login')}
        </div>
      )}

      {/* Hero principal */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20 px-4 text-center transition-colors duration-200">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
          <span className="text-black dark:text-white">Portal</span>
          <span className="text-blue-600 dark:text-blue-400">50+</span>
        </h1>
        <p className="text-2xl md:text-3xl mb-10 max-w-3xl mx-auto font-medium">
          {t('home.welcome_subtitle')}
        </p>
        {user ? (
          <div className="flex justify-center items-center min-h-[300px] mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl">
              {/* Empresa: Quiero contratar y Quiero aprender */}
              {user.rol === "empresa" && (
                <>
                  <Link to="/quiero-contratar" className="border border-gray-200 dark:border-gray-600 p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">{t('home.hire_section.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('home.hire_section.card_description')}</p>
                  </Link>
                  <Link to="/aprender" className="border border-gray-200 dark:border-gray-600 p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600 dark:text-green-400">{t('home.learn_section.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('home.learn_section.card_description')}</p>
                  </Link>
                </>
              )}
              {/* Trabajador: Quiero trabajar y Quiero aprender */}
              {(user.rol === "profesional" || user.rol === "profesional-ejecutivo") && (
                <>
                  <Link to="/trabajar" className="border border-gray-200 dark:border-gray-600 p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600 dark:text-green-400">{t('home.work_section.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('home.work_section.card_description')}</p>
                  </Link>
                  <Link to="/aprender" className="border border-gray-200 dark:border-gray-600 p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">{t('home.learn_section.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t('home.learn_section.card_description')}</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* Sección de información destacada */}
      <section className="pt-8 pb-20 px-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">{t('home.what_is_portal')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('home.what_is_description')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quiero trabajar */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden flex flex-col h-full">
              <div className="bg-blue-600 dark:bg-blue-700 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">{t('home.work_section.title')}</h3>
                <div className="w-12 h-0.5 bg-blue-200 dark:bg-blue-300"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {t('home.work_section.description')}
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">▪</span>
                      {t('home.work_section.benefit1')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">▪</span>
                      {t('home.work_section.benefit2')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">▪</span>
                      {t('home.work_section.benefit3')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">▪</span>
                      {t('home.work_section.benefit4')}
                    </li>
                  </ul>
                </div>
                <Link
                  to="/register-trabajador"
                  className="block w-full bg-blue-600 dark:bg-blue-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 border-2 border-blue-600 dark:border-blue-500 hover:border-blue-700 dark:hover:border-blue-600"
                >
                  {t('home.work_section.register_button')}
                </Link>
              </div>
            </div>

            {/* Quiero contratar */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden flex flex-col h-full">
              <div className="bg-green-600 dark:bg-green-700 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">{t('home.hire_section.title')}</h3>
                <div className="w-12 h-0.5 bg-green-200 dark:bg-green-300"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {t('home.hire_section.description')}
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-600 dark:text-green-400 mr-3 mt-1">▪</span>
                      {t('home.hire_section.benefit1')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 dark:text-green-400 mr-3 mt-1">▪</span>
                      {t('home.hire_section.benefit2')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 dark:text-green-400 mr-3 mt-1">▪</span>
                      {t('home.hire_section.benefit3')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 dark:text-green-400 mr-3 mt-1">▪</span>
                      {t('home.hire_section.benefit4')}
                    </li>
                  </ul>
                </div>
                <Link
                  to="/register-empresa"
                  className="block w-full bg-green-600 dark:bg-green-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 border-2 border-green-600 dark:border-green-500 hover:border-green-700 dark:hover:border-green-600"
                >
                  {t('home.hire_section.register_button')}
                </Link>
              </div>
            </div>

            {/* Quiero aprender */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 overflow-hidden flex flex-col h-full">
              <div className="bg-purple-600 dark:bg-purple-700 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">{t('home.learn_section.title')}</h3>
                <div className="w-12 h-0.5 bg-purple-200 dark:bg-purple-300"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {t('home.learn_section.description')}
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-3 mt-1">▪</span>
                      {t('home.learn_section.benefit1')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-3 mt-1">▪</span>
                      {t('home.learn_section.benefit2')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-3 mt-1">▪</span>
                      {t('home.learn_section.benefit3')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 dark:text-purple-400 mr-3 mt-1">▪</span>
                      {t('home.learn_section.benefit4')}
                    </li>
                  </ul>
                </div>
                <Link
                  to="/register-aprendiz"
                  className="block w-full bg-purple-600 dark:bg-purple-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-300 border-2 border-purple-600 dark:border-purple-500 hover:border-purple-700 dark:hover:border-purple-600"
                >
                  {t('home.learn_section.register_button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección para administradores - discreta */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('home.admin_access')}{" "}
              <Link 
                to="/admin" 
                className="text-red-600 dark:text-red-400 hover:underline font-medium"
              >
                {t('home.admin_link')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
