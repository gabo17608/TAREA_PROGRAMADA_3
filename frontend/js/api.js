const API_BASE_URL = "http://localhost:3000/api";


// Función para obtener headers, incluyendo JWT si existe
function getHeaders(isJson = true) {
const headers = {};
if (isJson) headers["Content-Type"] = "application/json";
const token = localStorage.getItem("token");
if (token) headers["Authorization"] = `Bearer ${token}`;
return headers;
}

// Función GET genérica
async function get(endpoint) {
try {
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
method: "GET",
headers: getHeaders(),
});


    const data = await response.json();
    if (!response.ok) {
        return { success: false, data: null, error: data.message || "Error en GET" };
    }
    return { success: true, data, error: null };
} catch (err) {
    console.error("GET fetch error:", err);
    return { success: false, data: null, error: err.message || "Error de red" };
}


}

// Función POST genérica
async function post(endpoint, body) {
try {
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
method: "POST",
headers: getHeaders(),
body: JSON.stringify(body),
});


    const data = await response.json();
    if (!response.ok) {
        return { success: false, data: null, error: data.message || "Error en POST" };
    }
    return { success: true, data, error: null };
} catch (err) {
    console.error("POST fetch error:", err);
    return { success: false, data: null, error: err.message || "Error de red" };
}


}

// Exportar funciones para usar en otros JS
export { get, post };
