export const config = {
    useLocalhost: true,
    API_URL: function() {
      return this.useLocalhost ? 'http://localhost:8080' : '/api';
    }
  };