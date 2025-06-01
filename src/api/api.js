// export const API_BASE_URL = 'http://127.0.0.1:5000/api';
export const API_BASE_URL = 'https://karaoke-app-backend-v2-production.up.railway.app/api';

export class ApiError extends Error {
    constructor(message, statusCode, serverMessage) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.serverMessage = serverMessage;
    }
}

export async function handleApiResponse(response) {
    // First check if the HTTP request itself failed
    if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;

        try {
            const errorData = await response.json();
            // Check if your API returns error info in JSON even for HTTP errors
            errorMessage = errorData.error || errorData.detail?.message || errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }

        throw new ApiError(errorMessage, response.status);
    }

    // Parse the JSON response
    const data = await response.json();

    // Now check your API's success field
    if (!data.success) {
        const errorMessage = data.error || 'API request failed';
        throw new ApiError(errorMessage, response.status, data.error);
    }

    return data; // Return the full response object with success, data, etc.
}