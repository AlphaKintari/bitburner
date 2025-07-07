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
    for (const name of scripts) {
        if (!ns.fileExists(name, "home")) {
            ns.tprint(`Missing script: ${name}. Please ensure all scripts are present in the dev/prod folder.`);
            continue;
        }
        ns.tprint(`Running ${name}...`);
        ns.tail(name, "home");
        ns.run(name, 1);
        await ns.sleep(1000);
    }
    ns.tprint("All automation and utility scripts launched. Tail windows opened for monitoring.");
}
