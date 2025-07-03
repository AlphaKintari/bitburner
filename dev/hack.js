/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0] || "n00dles";
    const logFile = "logs/error-log.txt";
    while(true) {
        try {
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
