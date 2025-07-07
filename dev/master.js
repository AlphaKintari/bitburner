// master.js - The script to rule them all: creates and manages essential scripts

/** @param {NS} ns **/
export async function main(ns) {

    // List of essential scripts and their default content
    const scripts = [
        {
            name: "hack.js",
            content: `/** @param {NS} ns **/\nexport async function main(ns) {\n    while(true) {\n        await ns.hack(ns.args[0] || \"n00dles\");\n        await ns.sleep(100);\n    }\n}`
        },
        {
            name: "grow.js",
            content: `/** @param {NS} ns **/\nexport async function main(ns) {\n    while(true) {\n        await ns.grow(ns.args[0] || \"n00dles\");\n        await ns.sleep(100);\n    }\n}`
        },
        {
            name: "weaken.js",
            content: `/** @param {NS} ns **/\nexport async function main(ns) {\n    while(true) {\n        await ns.weaken(ns.args[0] || \"n00dles\");\n        await ns.sleep(100);\n    }\n}`
        }
    ];

    // List of essential programs and their code (for coding contracts or custom logic)
    const programs = [
        {
            name: "BruteSSH.exe",
            code: null // Bitburner does not allow creating real .exe, but you can add custom logic or placeholder
        },
        {
            name: "FTPCrack.exe",
            code: null
        },
        {
            name: "relaySMTP.exe",
            code: null
        },
        {
            name: "HTTPWorm.exe",
            code: null
        },
        {
            name: "SQLInject.exe",
            code: null
        }
    ];

    for (const script of scripts) {
        if (!ns.fileExists(script.name, "home")) {
            ns.tprint(`Creating ${script.name}...`);
            await ns.write(script.name, script.content, "w");
        } else {
            ns.tprint(`${script.name} already exists.`);
        }
    }

    // Auto-buy TOR router if needed and possible
    if (!ns.getPlayer().tor) {
        const torCost = 200000;
        if (ns.getPlayer().money > torCost) {
            ns.tprint(`Attempting to purchase TOR router for $${torCost}...`);
            if (ns.purchaseTor()) {
                ns.tprint("Successfully purchased TOR router!");
            } else {
                ns.tprint("Failed to purchase TOR router.");
            }
        } else {
            ns.tprint("TOR router not owned and not enough funds to buy it.");
        }
    } else {
        ns.tprint("TOR router already owned.");
    }

    // Check for essential programs, autobuy if possible, or prompt to buy
    for (const prog of programs) {
        if (!ns.fileExists(prog.name, "home")) {
            // Try to buy if possible
            if (ns.getPlayer().tor && ns.getPlayer().money > ns.getDarkwebProgramCost(prog.name)) {
                const cost = ns.getDarkwebProgramCost(prog.name);
                ns.tprint(`Attempting to buy ${prog.name} for $${cost}...`);
                if (ns.purchaseProgram(prog.name)) {
                    ns.tprint(`Successfully purchased ${prog.name}!`);
                } else {
                    ns.tprint(`Failed to purchase ${prog.name}.`);
                }
            } else if (!ns.getPlayer().tor) {
                ns.tprint(`Program missing: ${prog.name}. Buy a TOR router to access the Dark Web and purchase this program!`);
            } else {
                ns.tprint(`Program missing: ${prog.name}. Not enough funds to buy it from the Dark Web.`);
            }
        } else {
            ns.tprint(`Program present: ${prog.name}`);
        }
    }

    // Helper: scan all servers recursively
    function scanAllServers(ns, start = "home", discovered = new Set()) {
        discovered.add(start);
        for (const neighbor of ns.scan(start)) {
            if (!discovered.has(neighbor)) {
                scanAllServers(ns, neighbor, discovered);
            }
        }
        return Array.from(discovered);
    }

    // Helper: try to gain root access
    function tryRoot(ns, server) {
        if (ns.hasRootAccess(server)) return true;
        const ports = ns.getServerNumPortsRequired(server);
        let opened = 0;
        if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); opened++; }
        if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); opened++; }
        if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server); opened++; }
        if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); opened++; }
        if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); opened++; }
        if (opened >= ports) {
            ns.nuke(server);
            return true;
        }
        return false;
    }

    // Helper: deploy scripts to a server
    async function deployScripts(ns, server, target) {
        if (!ns.hasRootAccess(server) || server === "home") return;
        const maxRam = ns.getServerMaxRam(server);
        const usedRam = ns.getServerUsedRam(server);
        const hackRam = ns.getScriptRam("hack.js", server);
        const growRam = ns.getScriptRam("grow.js", server);
        const weakenRam = ns.getScriptRam("weaken.js", server);
        let freeRam = maxRam - usedRam;
        if (freeRam < Math.min(hackRam, growRam, weakenRam)) return;

        // Dynamic thread allocation
        let sec = ns.getServerSecurityLevel(target);
        let minSec = ns.getServerMinSecurityLevel(target);
        let money = ns.getServerMoneyAvailable(target);
        let maxMoney = ns.getServerMaxMoney(target);
        let weakenThreads = 0, growThreads = 0, hackThreads = 0;
        if (sec > minSec + 5) {
            weakenThreads = Math.floor(freeRam / weakenRam);
        } else if (money < maxMoney * 0.75) {
            growThreads = Math.floor(freeRam / growRam);
        } else {
            hackThreads = Math.floor(freeRam / hackRam);
        }

        // Deploy scripts as needed
        if (weakenThreads > 0 && !ns.isRunning("weaken.js", server, target)) {
            await ns.scp("weaken.js", server);
            ns.exec("weaken.js", server, weakenThreads, target);
            ns.tprint(`Deployed weaken.js x${weakenThreads} to ${server} targeting ${target}`);
        }
        if (growThreads > 0 && !ns.isRunning("grow.js", server, target)) {
            await ns.scp("grow.js", server);
            ns.exec("grow.js", server, growThreads, target);
            ns.tprint(`Deployed grow.js x${growThreads} to ${server} targeting ${target}`);
        }
        if (hackThreads > 0 && !ns.isRunning("hack.js", server, target)) {
            await ns.scp("hack.js", server);
            ns.exec("hack.js", server, hackThreads, target);
            ns.tprint(`Deployed hack.js x${hackThreads} to ${server} targeting ${target}`);
        }
    }

    // Main persistent loop
    while (true) {
        const allServers = scanAllServers(ns);
        // Watchdog: restart critical scripts if not running
        const criticalScripts = ["auto-root.js", "deployer.js", "auto-buy.js", "auto-server-upgrade.js", "auto-hacknet.js", "auto-contracts.js", "status.js", "messenger.js"];
        for (const script of criticalScripts) {
            if (!ns.isRunning(script, "home")) {
                ns.run(`dev/${script}`);
                ns.tprint(`[WATCHDOG] Restarted ${script}`);
            }
        }

        // Faction/augmentation automation (basic)
        if (ns.checkFactionInvitations) {
            const invites = ns.checkFactionInvitations();
            for (const faction of invites) {
                ns.tprint(`[FACTION] Auto-joining ${faction}`);
                ns.joinFaction(faction);
            }
        }
        // TODO: Add augmentation auto-purchase logic if desired

        // Root all servers except home and pserv-*
        for (const server of allServers) {
            if (server === "home" || server.startsWith("pserv-")) continue;
            tryRoot(ns, server);
        }
        // Smart target selection: rotate among top 3 targets
        let targets = allServers.filter(s => ns.hasRootAccess(s) && ns.getServerMaxMoney(s) > 0 && ns.getServerRequiredHackingLevel(s) <= ns.getHackingLevel() && !s.startsWith("pserv-"));
        targets = targets.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
        const topTargets = targets.slice(0, 3);
        let target = "n00dles";
        if (topTargets.length > 0) {
            target = topTargets[Math.floor(Date.now() / 60000) % topTargets.length];
        }

        // Deploy to all external servers
        for (const server of allServers) {
            if (server.startsWith("pserv-")) continue;
            await deployScripts(ns, server, target);
        }
        // Deploy to purchased servers, always target best external server
        for (const pserv of allServers.filter(s => s.startsWith("pserv-"))) {
            await deployScripts(ns, pserv, target);
        }

        // Optionally: buy servers, upgrade home, etc. (expand here as you progress)
        await ns.sleep(5000);
    }
}
