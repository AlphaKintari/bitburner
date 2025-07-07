// deployer.js - Deploys hack/grow/weaken scripts to all rooted servers

/**
 * Deploys hack/grow/weaken scripts to all rooted servers except home and purchased servers.
 * 
 * @param {NS} ns - Netscript API object provided by Bitburner
 */
async function main(ns) {
    // List of script filenames to deploy
    const scripts = ["hack.js", "grow.js", "weaken.js"];

    /**
     * Recursively scans the entire network starting from a given server.
     * Returns an array of all discovered server names.
     *
     * @param {NS} ns - Netscript API
     * @param {string} start - Server to start scanning from (default: "home")
     * @param {Set<string>} discovered - Set to keep track of found servers
     * @returns {string[]} Array of all server names found
     */
    function scanAllServers(ns, start = "home", discovered = new Set()) {
        discovered.add(start); // Mark this server as discovered
        for (const neighbor of ns.scan(start)) { // Get all directly connected servers
            if (!discovered.has(neighbor)) { // If we haven't seen this server yet
                scanAllServers(ns, neighbor, discovered); // Recursively scan it
            }
        }
        return Array.from(discovered); // Convert Set to Array and return
    }

    // Get all servers except home and purchased servers ("pserv-*")
    const servers = scanAllServers(ns)
        .filter(s => s !== "home" && !s.startsWith("pserv-"));

    // Loop through each server
    for (const server of servers) {
        // Only deploy to servers we have root access to
        if (!ns.hasRootAccess(server)) continue;

        // Copy each script to the server if it's not already there
        for (const script of scripts) {
            if (!ns.fileExists(script, server)) {
                await ns.scp(script, server); // scp = copy file to server
            }
        }

        // Try to run one thread of each script, targeting the server itself
        for (const script of scripts) {
            // Only start if not already running with the same arguments
            if (!ns.isRunning(script, server, server)) {
                try {
                    ns.exec(script, server, 1, server); // Run 1 thread, target = server
                    ns.tprint(`Started ${script} on ${server}`);
                } catch (e) {
                    ns.tprint(`Failed to start ${script} on ${server}: ${e}`);
                }
            }
        }
    }

    ns.tprint("Deployment complete.");
}

/** Bitburner compatibility: main must be defined at top level */
export { main };
