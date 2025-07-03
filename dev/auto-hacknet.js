// auto-hacknet.js - Automate Hacknet node purchase and upgrades
/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        // Buy new node if affordable
        if (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) {
            const idx = ns.hacknet.purchaseNode();
            if (typeof idx === 'number') ns.tprint(`[HACKNET] Purchased node ${idx}`);
        }
        // Upgrade all nodes
        const nodes = ns.hacknet.numNodes();
        for (let i = 0; i < nodes; ++i) {
            // Upgrade level
            while (ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(i, 1)) {
                ns.hacknet.upgradeLevel(i, 1);
            }
            // Upgrade RAM
            while (ns.getPlayer().money > ns.hacknet.getRamUpgradeCost(i, 1)) {
                ns.hacknet.upgradeRam(i, 1);
            }
            // Upgrade cores
            while (ns.getPlayer().money > ns.hacknet.getCoreUpgradeCost(i, 1)) {
                ns.hacknet.upgradeCore(i, 1);
            }
        }
        await ns.sleep(30000); // Check every 30 seconds
    }
}
