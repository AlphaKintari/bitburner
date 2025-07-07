/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0] || "n00dles";
    const logFile = "logs/error-log.txt";
    while(true) {
        try {
            // Check if we have enough hacking skill before attempting
            if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target)) {
                const warnMsg = `[${target}] Skipping hack: hacking skill too low.`;
                ns.print(warnMsg);
                await ns.write(logFile, warnMsg + "\n", "a");
                await ns.sleep(5000);
                continue;
            }
            const before = ns.getServerMoneyAvailable(target);
            const hacked = await ns.hack(target);
            const after = ns.getServerMoneyAvailable(target);
            const msg = `[${target}] Hacked: $${hacked.toLocaleString()} | Before: $${before.toLocaleString()} | After: $${after.toLocaleString()}`;
            ns.tprint(msg);
        } catch (e) {
            const errMsg = `[${target}] Hack error: ${e}`;
            ns.tprint(errMsg);
            await ns.write(logFile, errMsg + "\n", "a");
        }
        await ns.sleep(100);
    }
}
