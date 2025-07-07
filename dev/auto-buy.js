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
                // Progress bar logic
                const money = ns.getPlayer().money;
                const percent = Math.min(100, Math.floor((money / cost) * 100));
                const barLength = 20;
                const filled = Math.floor((percent / 100) * barLength);
                const bar = `[${"#".repeat(filled)}${"-".repeat(barLength - filled)}]`;
                ns.print(`Waiting to buy ${prog}: $${ns.nFormat(money, '0.00a')} / $${ns.nFormat(cost, '0.00a')} ${bar} ${percent}%`);
                await ns.sleep(2000);
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
    // If not enough money for RAM upgrade, show progress bar
    if (ns.upgradeHomeRam && ns.getPlayer().money < ns.getUpgradeHomeRamCost()) {
        const cost = ns.getUpgradeHomeRamCost();
        while (ns.getPlayer().money < cost) {
            const money = ns.getPlayer().money;
            const percent = Math.min(100, Math.floor((money / cost) * 100));
            const barLength = 20;
            const filled = Math.floor((percent / 100) * barLength);
            const bar = `[${"#".repeat(filled)}${"-".repeat(barLength - filled)}]`;
            ns.print(`Waiting to upgrade home RAM: $${ns.nFormat(money, '0.00a')} / $${ns.nFormat(cost, '0.00a')} ${bar} ${percent}%`);
            await ns.sleep(2000);
        }
    }

    // Upgrade home cores as much as possible (wait if not enough money)
    while (ns.upgradeHomeCores && ns.getPlayer().money > ns.getUpgradeHomeCoresCost()) {
        ns.tprint("Upgrading home CPU cores...");
        ns.upgradeHomeCores();
        await ns.sleep(1000);
    }
    // If not enough money for core upgrade, show progress bar
    if (ns.upgradeHomeCores && ns.getPlayer().money < ns.getUpgradeHomeCoresCost()) {
        const cost = ns.getUpgradeHomeCoresCost();
        while (ns.getPlayer().money < cost) {
            const money = ns.getPlayer().money;
            const percent = Math.min(100, Math.floor((money / cost) * 100));
            const barLength = 20;
            const filled = Math.floor((percent / 100) * barLength);
            const bar = `[${"#".repeat(filled)}${"-".repeat(barLength - filled)}]`;
            ns.print(`Waiting to upgrade home CPU cores: $${ns.nFormat(money, '0.00a')} / $${ns.nFormat(cost, '0.00a')} ${bar} ${percent}%`);
            await ns.sleep(2000);
        }
    }

    // Buy and upgrade servers (start with 8GB, increase if you want)
    const maxServers = ns.getPurchasedServerLimit();
    const ram = 8;
    for (let i = 0; i < maxServers; ++i) {
        const name = `pserv-${i}`;
        if (!ns.serverExists(name)) {
            const cost = ns.getPurchasedServerCost(ram);
            while (ns.getPlayer().money < cost) {
                const money = ns.getPlayer().money;
                const percent = Math.min(100, Math.floor((money / cost) * 100));
                const barLength = 20;
                const filled = Math.floor((percent / 100) * barLength);
                const bar = `[${"#".repeat(filled)}${"-".repeat(barLength - filled)}]`;
                ns.print(`Waiting to buy server ${name}: $${ns.nFormat(money, '0.00a')} / $${ns.nFormat(cost, '0.00a')} ${bar} ${percent}%`);
                await ns.sleep(2000);
            }
            ns.tprint(`Buying server ${name}...`);
            ns.purchaseServer(name, ram);
        }
    }
    ns.tprint("Auto-buy and home upgrade complete.");
}
