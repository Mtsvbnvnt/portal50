export const saveTipoContratacion = async (uid: string, tipo: string, token: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/empresas/tipo-contratacion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ tipo, uid }),
    });
    
    if (!response.ok) {
      throw new Error('Error guardando tipo de contratación');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en saveTipoContratacion:', error);
    throw error;
  }
};