// auto-server-upgrade.js - Automatically purchase and upgrade servers
/** @param {NS} ns **/
export async function main(ns) {
    const maxServers = ns.getPurchasedServerLimit();
    let ram = 8;
    const maxRam = ns.getPurchasedServerMaxRam();
    while (true) {
        // Try to buy new servers
        for (let i = 0; i < maxServers; ++i) {
            const name = `pserv-${i}`;
            if (!ns.serverExists(name) && ns.getPlayer().money > ns.getPurchasedServerCost(ram)) {
                ns.purchaseServer(name, ram);
                ns.tprint(`[SERVER] Purchased ${name} with ${ram}GB RAM.`);
            }
        }
        // Try to upgrade existing servers
        for (let i = 0; i < maxServers; ++i) {
            const name = `pserv-${i}`;
            if (ns.serverExists(name)) {
                let currentRam = ns.getServerMaxRam(name);
                if (currentRam < maxRam && ns.getPlayer().money > ns.getPurchasedServerCost(currentRam * 2)) {
                    ns.killall(name);
                    ns.deleteServer(name);
                    ns.purchaseServer(name, currentRam * 2);
                    ns.tprint(`[SERVER] Upgraded ${name} to ${currentRam * 2}GB RAM.`);
                }
            }
        }
        // Increase base RAM as you get richer
        if (ram < maxRam && ns.getPlayer().money > ns.getPurchasedServerCost(ram * 2) * maxServers) {
            ram *= 2;
            ns.tprint(`[SERVER] Increasing base RAM for new servers to ${ram}GB.`);
        }
        await ns.sleep(60000); // Check every minute
    }
}
