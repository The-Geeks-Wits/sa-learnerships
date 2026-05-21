export const backendURL = () => {
    const environment = 'prod'; // The environment the app is under
    if (environment === 'dev') return 'http://localhost:3000';
    else if (environment === 'prod') return 'https://sa-learnerships-aadwawdsbyhngnc5.southafricanorth-01.azurewebsites.net';;
};
