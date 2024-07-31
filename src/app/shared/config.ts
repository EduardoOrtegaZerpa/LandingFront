export const config = {
    useLocalhost: false,
    API_URL: function() {
      return this.useLocalhost ? 'http://localhost:8080' : 'https://eduortza.com:8443';
    }
  };