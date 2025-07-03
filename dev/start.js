// start.js - One-click launcher for Bitburner automation
/** @param {NS} ns **/
export async function main(ns) {
    const scripts = [
        { name: "dev/update-program-list.js", args: [] },
        { name: "dev/master.js", args: [] },
        { name: "dev/auto-root.js", args: [] },
        { name: "dev/deployer.js", args: [] },
        { name: "dev/auto-buy.js", args: [] },
        { name: "dev/auto-server-upgrade.js", args: [] },
        { name: "dev/auto-hacknet.js", args: [] },
        { name: "dev/auto-contracts.js", args: [] },
        { name: "dev/status.js", args: [] },
        { name: "dev/messenger.js", args: [] }
    ];
    for (const { name, args } of scripts) {
        if (!ns.fileExists(name, "home")) {
            ns.tprint(`Missing script: ${name}. Please ensure all scripts are present in the dev folder.`);
            continue;
        }
        ns.tprint(`Running ${name}...`);
        // Open a tail window for the script
        ns.tail(name, "home", ...args);
        // Run each script in a separate process
        ns.run(name, 1, ...args);
        // Wait a bit between scripts to allow for setup
        await ns.sleep(1000);
    }
    ns.tprint("All automation scripts launched. Tail windows opened for monitoring.");
}
