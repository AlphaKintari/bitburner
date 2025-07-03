// auto-buy.js - Automatically buy programs and servers as soon as you can afford them
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
    for (const prog of programs) {
        if (!ns.fileExists(prog, "home") && ns.getPlayer().money > ns.getDarkwebProgramCost(prog)) {
            ns.tprint(`Buying ${prog}...`);
            ns.purchaseProgram(prog);
        }
    }
    // Buy and upgrade servers
    const maxServers = ns.getPurchasedServerLimit();
    const ram = 8; // Start with 8GB, increase as you get richer
    for (let i = 0; i < maxServers; ++i) {
        const name = `pserv-${i}`;
        if (!ns.serverExists(name) && ns.getPlayer().money > ns.getPurchasedServerCost(ram)) {
            ns.tprint(`Buying server ${name}...`);
            ns.purchaseServer(name, ram);
        }
    }
    ns.tprint("Auto-buy complete.");
}
