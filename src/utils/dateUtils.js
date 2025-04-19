export const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    
    try {
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };
  
  export const formatDateTime = (dateString) => {
    if (!dateString) return 'Sin fecha/hora';
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    };
    
    try {
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error formateando fecha/hora:', error);
      return 'Fecha/hora inválida';
    }
  };