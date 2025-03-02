/*
export function getRoleFromToken() {
    const token = localStorage.getItem('jwt'); // Token'ı localStorage'dan alıyoruz
    if (!token) return null;
  
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Base64 çözme
    return decodedToken.role; // JWT içinde 'role' bilgisini döndürüyoruz
  }
  */


  function base64UrlDecode(base64Url) {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64 URL'yi Base64'e dönüştür
    return atob(base64); // Base64 çözme işlemi
  }
  
  // Token'ın payload kısmını çözmek için:
  export function getRoleFromToken(token) {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        // Payload'ı çöz
        const payload = base64UrlDecode(tokenParts[1]);
        const decodedPayload = JSON.parse(payload);
        return decodedPayload.role; // Kullanıcı rolünü döndür
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }