// attack.js - Attacks all servers with root access found in logs/hacked.txt

/** @param {NS} ns **/
export async function main(ns) {
    const hackedFile = "/logs/hacked.txt";
    let data;
    try {
        data = ns.read(hackedFile);
    } catch (e) {
        ns.tprint(`Could not read ${hackedFile}: ${e}`);
        return;
    }
    if (!data) {
        ns.tprint(`No data found in ${hackedFile}. Run explore.js first.`);
        return;
    }

    // Parse servers from hacked.txt
    const targets = [];
    for (const line of data.split("\n")) {
        // Each line: [path] | server
        const match = line.match(/\|\s*([^|\s]+)\s*$/);
        if (match) {
            const server = match[1].trim();
            if (server !== "home") targets.push(server);
        }
    }
    if (targets.length === 0) {
        ns.tprint("No hackable targets found in hacked.txt.");
        return;
    }
    ns.tprint(`Attacking servers: ${targets.join(", ")}`);
    while (true) {
        for (const target of targets) {
            let originalMoney = ns.getServerMoneyAvailable(target);
            if (originalMoney <= 0) {
                ns.print(`Skipping ${target}: no money available.`);
                continue;
            }
            // Grow once to maximize available money
            await ns.grow(target);
            originalMoney = ns.getServerMoneyAvailable(target);
            let minMoney = originalMoney * 0.2;
            while (ns.getServerMoneyAvailable(target) > minMoney) {
                await ns.hack(target);
                await ns.weaken(target);
            }
            ns.print(`Finished hacking ${target}: money reduced to 20% or less of grown amount.`);
        }
    }
}
