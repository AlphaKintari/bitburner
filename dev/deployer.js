// deployer.js - Deploys hack/grow/weaken scripts to all rooted servers
/** @param {NS} ns **/
export async function main(ns) {
    const scripts = ["hack.js", "grow.js", "weaken.js"];
    function scanAllServers(ns, start = "home", discovered = new Set()) {
        discovered.add(start);
        for (const neighbor of ns.scan(start)) {
            if (!discovered.has(neighbor)) {
                scanAllServers(ns, neighbor, discovered);
            }
        }
        return Array.from(discovered);
    }
    const servers = scanAllServers(ns).filter(s => s !== "home" && !s.startsWith("pserv-"));
    for (const server of servers) {
        if (!ns.hasRootAccess(server)) continue;
        for (const script of scripts) {
            if (!ns.fileExists(script, server)) {
                await ns.scp(script, server);
            }
        }
        // Try to run one thread of each script targeting the server itself
        for (const script of scripts) {
            if (!ns.isRunning(script, server, server)) {
                try {
                    ns.exec(script, server, 1, server);
                    ns.tprint(`Started ${script} on ${server}`);
                } catch (e) {
                    ns.tprint(`Failed to start ${script} on ${server}: ${e}`);
                }
            }
        }
    }
    ns.tprint("Deployment complete.");
}
