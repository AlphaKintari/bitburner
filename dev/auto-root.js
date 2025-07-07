// auto-root.js - Automatically scan and root all servers you can access
/** @param {NS} ns **/
export async function main(ns) {
    function scanAllServers(ns, start = "home", discovered = new Set()) {
        discovered.add(start);
        for (const neighbor of ns.scan(start)) {
            if (!discovered.has(neighbor)) {
                scanAllServers(ns, neighbor, discovered);
            }
        }
        return Array.from(discovered);
    }

    const servers = scanAllServers(ns);
    // List of available port openers (dynamically based on your markdown)
    const portOpeners = [];
    if (ns.fileExists("BruteSSH.exe", "home")) portOpeners.push(s => ns.brutessh(s));
    if (ns.fileExists("FTPCrack.exe", "home")) portOpeners.push(s => ns.ftpcrack(s));
    if (ns.fileExists("relaySMTP.exe", "home")) portOpeners.push(s => ns.relaysmtp(s));
    if (ns.fileExists("HTTPWorm.exe", "home")) portOpeners.push(s => ns.httpworm(s));
    if (ns.fileExists("SQLInject.exe", "home")) portOpeners.push(s => ns.sqlinject(s));

    for (const server of servers) {
        if (server === "home" || ns.hasRootAccess(server)) continue;
        // Use only available port openers
        for (const opener of portOpeners) {
            try { opener(server); } catch {}
        }
        if (portOpeners.length >= ns.getServerNumPortsRequired(server)) {
            try {
                ns.nuke(server);
                ns.tprint(`Rooted: ${server}`);
            } catch (e) {
                ns.tprint(`Failed to root ${server}: ${e}`);
            }
        }
    }
    ns.tprint("Auto-root complete.");
}
