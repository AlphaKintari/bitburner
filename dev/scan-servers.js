/**
 * scan-servers.js - Utility to recursively scan and return all servers in the network
 * @param {NS} ns
 * @returns {string[]} Array of all server names (including 'home')
 */
export function scanAllServers(ns, start = "home", discovered = new Set()) {
    discovered.add(start);
    for (const neighbor of ns.scan(start)) {
        if (!discovered.has(neighbor)) {
            scanAllServers(ns, neighbor, discovered);
        }
    }
    return Array.from(discovered);
}
