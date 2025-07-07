// autostart.js - Launches all automation and utility scripts in dev and prod folders
/** @param {NS} ns **/
export async function main(ns) {
    // List all scripts to autostart (dev and prod)
    const scripts = [
        // --- Core automation (dev) ---
        "dev/update-program-list.js",
        "dev/master.js",
        "dev/auto-root.js",
        "dev/deployer.js",
        "dev/auto-buy.js",
        "dev/auto-server-upgrade.js",
        "dev/auto-hacknet.js",
        "dev/auto-contracts.js",
        "dev/status.js",
        "dev/messenger.js",
        // --- Utility/learning/demo (dev) ---
        "dev/newbie.js",
        "dev/n00dles.js",
        "dev/hack.js",
        // --- Production/advanced (prod) ---
        "prod/explore.js",
        "prod/attack.js"
    ];
    // Open a dedicated status window (tail) for live status updates
    ns.tail();
    ns.print("[AUTOSTART] Launching all automation and utility scripts...");
    // Track which scripts have already had a tail window opened
    const tailed = new Set();
    for (const name of scripts) {
        if (!ns.fileExists(name, "home")) {
            ns.tprint(`Missing script: ${name}. Please ensure all scripts are present in the dev/prod folder.`);
            ns.print(`[AUTOSTART] Missing script: ${name}`);
            continue;
        }
        ns.tprint(`Running ${name}...`);
        ns.print(`[AUTOSTART] Running ${name}...`);
        if (!tailed.has(name)) {
            ns.tail(name, "home");
            tailed.add(name);
        }
        ns.run(name, 1);
        await ns.sleep(1000);
    }
    ns.print("[AUTOSTART] All automation and utility scripts launched. Tail windows opened for monitoring.");
    ns.tprint("All automation and utility scripts launched. Tail windows opened for monitoring.");
}
