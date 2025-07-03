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
    for (const server of servers) {
        if (server === "home" || ns.hasRootAccess(server)) continue;
        try {
            if (ns.fileExists("BruteSSH.exe", "home")) ns.brutessh(server);
            if (ns.fileExists("FTPCrack.exe", "home")) ns.ftpcrack(server);
            if (ns.fileExists("relaySMTP.exe", "home")) ns.relaysmtp(server);
            if (ns.fileExists("HTTPWorm.exe", "home")) ns.httpworm(server);
            if (ns.fileExists("SQLInject.exe", "home")) ns.sqlinject(server);
            ns.nuke(server);
            ns.tprint(`Rooted: ${server}`);
        } catch (e) {
            ns.tprint(`Failed to root ${server}: ${e}`);
        }
    }
    ns.tprint("Auto-root complete.");
}
