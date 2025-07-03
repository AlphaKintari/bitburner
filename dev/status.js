/**
 * status.js - Displays a floating window with the status of all running scripts on home.
 * Shows money, security, and last log line for each process's target server if possible.
 * @param {NS} ns
 */
export async function main(ns) {
    ns.tail(); // Always open a tail window for this script
    const logFile = "logs/error-log.txt";
    let lastMoney = ns.getPlayer().money;
    let lastHacking = ns.getHackingLevel();
    while (true) {
        ns.clearLog();
        // Money and skill updates
        const money = ns.getPlayer().money;
        const hacking = ns.getHackingLevel();
        let moneyChange = money - lastMoney;
        let hackingChange = hacking - lastHacking;
        ns.print(`[STATUS] Money: $${ns.nFormat(money, '0.00a')} (${moneyChange >= 0 ? '+' : ''}${ns.nFormat(moneyChange, '0.00a')}) | Hacking: ${hacking} (${hackingChange >= 0 ? '+' : ''}${hackingChange})`);
        lastMoney = money;
        lastHacking = hacking;
        // Error log
        ns.print("[STATUS] Monitoring error log: " + logFile);
        if (ns.fileExists(logFile, "home")) {
            const log = ns.read(logFile);
            ns.print(log);
        } else {
            ns.print("No errors logged yet.");
        }
        await ns.sleep(2000);
    }
}
