// auto-contracts.js - Scan for coding contracts and log their locations/types
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
    while (true) {
        const servers = scanAllServers(ns);
        let found = [];
        for (const server of servers) {
            const files = ns.ls(server, ".cct");
            for (const file of files) {
                const type = ns.codingcontract.getContractType(file, server);
                found.push(`[CONTRACT] ${file} on ${server}: ${type}`);
            }
        }
        if (found.length > 0) {
            await ns.write("logs/contracts.txt", found.join("\n") + "\n", "w");
            ns.tprint(`[CONTRACT] Found ${found.length} coding contracts. See logs/contracts.txt`);
        }
        await ns.sleep(60000); // Check every minute
    }
}
