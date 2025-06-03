import {API_BASE_URL, handleApiResponse} from "./api.js";

export async function getSessionByCode(code) {
    const response = await fetch(`${API_BASE_URL}/sessions/by-code/${code}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return handleApiResponse(response);
}

export async function createSession(title, admin_password, access_code = null) {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            admin_password,
            ...(access_code && { access_code })
        })
    });

    return handleApiResponse(response);
}

export async function updateSession(id, title) {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title})
    });

    return handleApiResponse(response);
}

export async function deleteSession(id) {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return handleApiResponse(response);
}