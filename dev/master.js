// master.js - The script to rule them all: creates and manages essential scripts

/**
 * Recursively scans the entire network and returns all server names.
 * @param {NS} ns - Netscript API
 * @param {string} start - Server to start from (default: "home")
 * @param {Set<string>} discovered - Set to keep track of found servers
 * @returns {string[]} Array of all server names
 */
function scanAllServers(ns, start = "home", discovered = new Set()) {
    discovered.add(start);
    for (const neighbor of ns.scan(start)) {
        if (!discovered.has(neighbor)) {
            scanAllServers(ns, neighbor, discovered);
        }
    }
    return Array.from(discovered);
}

/**
 * Attempts to gain root access on a server using all available hacking programs.
 * @param {NS} ns
 * @param {string} server
 * @returns {boolean} True if rooted, false otherwise
 */
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

/**
 * Deploys hack/grow/weaken scripts to a server, allocating threads based on RAM and server state.
 * @param {NS} ns
 * @param {string} server - Server to deploy to
 * @param {string} target - Target for scripts to hack/grow/weaken
 */
async function deployScripts(ns, server, target) {
    if (!ns.hasRootAccess(server) || server === "home") return;
    const maxRam = ns.getServerMaxRam(server);
    const usedRam = ns.getServerUsedRam(server);
    const hackRam = ns.getScriptRam("hack.js", server);
    const growRam = ns.getScriptRam("grow.js", server);
    const weakenRam = ns.getScriptRam("weaken.js", server);
    let freeRam = maxRam - usedRam;
    if (freeRam < Math.min(hackRam, growRam, weakenRam)) return;

    // Decide which script to run based on server state
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
    }
    if (growThreads > 0 && !ns.isRunning("grow.js", server, target)) {
        await ns.scp("grow.js", server);
        ns.exec("grow.js", server, growThreads, target);
    }
    if (hackThreads > 0 && !ns.isRunning("hack.js", server, target)) {
        await ns.scp("hack.js", server);
        ns.exec("hack.js", server, hackThreads, target);
    }
}

/**
 * Main function: manages script deployment, rooting, watchdog, and basic automation.
 * @param {NS} ns
 */
async function main(ns) {
    // List of essential scripts and their default content (auto-create if missing)
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

    // List of essential hacking programs (for auto-purchase)
    const programs = [
        { name: "BruteSSH.exe", code: null },
        { name: "FTPCrack.exe", code: null },
        { name: "relaySMTP.exe", code: null },
        { name: "HTTPWorm.exe", code: null },
        { name: "SQLInject.exe", code: null }
    ];

    // Auto-create hack/grow/weaken scripts if missing
    for (const script of scripts) {
        if (!ns.fileExists(script.name, "home")) {
            await ns.write(script.name, script.content, "w");
        }
    }

    // Auto-buy TOR router if needed and possible
    if (!ns.getPlayer().tor) {
        const torCost = 200000;
        if (ns.getPlayer().money > torCost) {
            ns.purchaseTor();
        }
    }

    // Auto-buy essential hacking programs if possible
    for (const prog of programs) {
        if (!ns.fileExists(prog.name, "home")) {
            if (ns.getPlayer().tor && ns.getPlayer().money > ns.getDarkwebProgramCost(prog.name)) {
                ns.purchaseProgram(prog.name);
            }
        }
    }

    while (true) {
        const allServers = scanAllServers(ns);

        // Watchdog: restart critical scripts if not running
        const criticalScripts = [
            "auto-root.js", "deployer.js", "auto-buy.js", "auto-server-upgrade.js", "auto-hacknet.js", "auto-contracts.js", "status.js", "messenger.js"
        ];
        for (const script of criticalScripts) {
            if (!ns.isRunning(script, "home")) {
                ns.run(`dev/${script}`);
            }
        }

        // Auto-join factions if invited
        if (ns.checkFactionInvitations) {
            const invites = ns.checkFactionInvitations();
            for (const faction of invites) {
                ns.joinFaction(faction);
            }
        }
        // TODO: Add augmentation auto-purchase logic if desired

        // Root all servers except home and purchased servers
        for (const server of allServers) {
            if (server === "home" || server.startsWith("pserv-")) continue;
            tryRoot(ns, server);
        }

        // Smart target selection: rotate among top 3 best money servers
        let targets = allServers.filter(s => ns.hasRootAccess(s) && ns.getServerMaxMoney(s) > 0 && ns.getServerRequiredHackingLevel(s) <= ns.getHackingLevel() && !s.startsWith("pserv-"));
        targets = targets.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
        const topTargets = targets.slice(0, 3);
        let target = "n00dles";
        if (topTargets.length > 0) {
            // Rotate target every minute
            target = topTargets[Math.floor(Date.now() / 60000) % topTargets.length];
        }

        // Deploy to all external servers (not purchased)
        for (const server of allServers) {
            if (server.startsWith("pserv-")) continue;
            await deployScripts(ns, server, target);
        }
        // Deploy to purchased servers, always target best external server
        for (const pserv of allServers.filter(s => s.startsWith("pserv-"))) {
            await deployScripts(ns, pserv, target);
        }

        await ns.sleep(5000); // Wait 5 seconds before next loop
    }
}

// Bitburner expects main to be defined at the top level
export { main };
