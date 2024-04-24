export function extractQueryParams(query) {
    return Object.fromEntries(query.substring(1).split("&").map(query => decodeURIComponent(query).split("=")))
}