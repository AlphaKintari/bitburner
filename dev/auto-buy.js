// auto-buy.js - Automatically buy programs, servers, and upgrade home as soon as you can afford them
/** @param {NS} ns **/
export async function main(ns) {
    // List of programs to buy in order
    const programs = [
        "BruteSSH.exe",
        "FTPCrack.exe",
        "relaySMTP.exe",
        "HTTPWorm.exe",
        "SQLInject.exe"
    ];
    // Buy all programs, waiting if needed
    for (const prog of programs) {
        if (!ns.fileExists(prog, "home")) {
            const cost = ns.getDarkwebProgramCost(prog);
            while (ns.getPlayer().money < cost) {
                await ns.sleep(5000); // Wait until you can afford it
            }
            ns.tprint(`Buying ${prog}...`);
            ns.purchaseProgram(prog);
        }
    }

    // Upgrade home RAM as much as possible (wait if not enough money)
    while (ns.upgradeHomeRam && ns.getPlayer().money > ns.getUpgradeHomeRamCost()) {
        ns.tprint("Upgrading home RAM...");
        ns.upgradeHomeRam();
        await ns.sleep(1000);
    }

    // Upgrade home cores as much as possible (wait if not enough money)
    while (ns.upgradeHomeCores && ns.getPlayer().money > ns.getUpgradeHomeCoresCost()) {
        ns.tprint("Upgrading home CPU cores...");
        ns.upgradeHomeCores();
        await ns.sleep(1000);
    }

    // Buy and upgrade servers (start with 8GB, increase if you want)
    const maxServers = ns.getPurchasedServerLimit();
    const ram = 8;
    for (let i = 0; i < maxServers; ++i) {
        const name = `pserv-${i}`;
        if (!ns.serverExists(name)) {
            const cost = ns.getPurchasedServerCost(ram);
            while (ns.getPlayer().money < cost) {
                await ns.sleep(5000);
            }
            ns.tprint(`Buying server ${name}...`);
            ns.purchaseServer(name, ram);
        }
    }
    ns.tprint("Auto-buy and home upgrade complete.");
}
