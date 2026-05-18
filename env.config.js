export const backendURL = () => {
const environment = 'dev'; // The environment the app is under
if (environment === 'dev') return 'http://localhost:3000';
else if (environment === 'prod') return 'https://salearnerships.azurewebsites.net';
};