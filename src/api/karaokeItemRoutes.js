import {API_BASE_URL, handleApiResponse} from "./api.js";

export async function getKaraokeItems(sessionId) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/items`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return handleApiResponse(response);
}

export async function createKaraokeItem(sessionId, username, title, artist) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, title, artist})
    });

    return handleApiResponse(response);
}

export async function getKaraokeItem(sessionId, itemId) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/items/${itemId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return handleApiResponse(response);
}

export async function updateKaraokeItem(sessionId, itemId, username, video_url, title) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, video_url, title})
    });

    return handleApiResponse(response);
}

export async function deleteKaraokeItem(sessionId, itemId) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return handleApiResponse(response);
}

export async function toggleKaraokeItemCompletion(sessionId, itemId) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/items/${itemId}/toggle`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return handleApiResponse(response);
}