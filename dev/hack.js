/**
 * hack.js - Robust auto-hacker for all servers you can access
 *
 * - Scans all servers using scan-servers.js
 * - Checks root, money, and skill using can-hack.js
 * - Logs warnings/errors using logger.js (suppresses repeated warnings)
 * - Handles all runtime errors gracefully
 *
 * @param {NS} ns
 */
import { scanAllServers } from "dev/scan-servers.js";
import { Logger } from "dev/logger.js";

export async function main(ns) {
    const logFile = "logs/error-log.txt";
    const logger = new Logger(ns, logFile);

    // If run with a target argument, only hack that server (with all checks)
    const targetArg = ns.args[0];
    if (targetArg) {
        const target = targetArg;
        // Check root, money, and skill before attempting hack
        if (!ns.hasRootAccess(target) || ns.getServerMaxMoney(target) === 0) {
            await logger.warnOnce(target, `[${target}] Skipping hack: no root or no money.`);
            return;
        }
        const skillReq = ns.getServerRequiredHackingLevel(target);
        if (ns.getHackingLevel() < skillReq) {
            await logger.warnOnce(target, `[${target}] Skipping hack: hacking skill too low.`);
            return;
        }
        try {
            const before = ns.getServerMoneyAvailable(target);
            const hacked = await ns.hack(target);
            const after = ns.getServerMoneyAvailable(target);
            const msg = `[${target}] Hacked: $${hacked.toLocaleString()} | Before: $${before.toLocaleString()} | After: $${after.toLocaleString()}`;
            ns.tprint(msg);
        } catch (hackErr) {
            const errStr = String(hackErr);
            if (errStr.includes("because your hacking skill is not high enough")) {
                await logger.warnOnce(target, `[${target}] Skipping hack (runtime): hacking skill too low.`);
            } else {
                await logger.error(`[${target}] Hack error: ${hackErr}`);
            }
        }
        return;
    }

    // Otherwise, scan and hack all eligible servers
    while (true) {
        const servers = scanAllServers(ns).filter(s => s !== "home");
        for (const target of servers) {
            if (!ns.hasRootAccess(target) || ns.getServerMaxMoney(target) === 0) continue;
            const skillReq = ns.getServerRequiredHackingLevel(target);
            if (ns.getHackingLevel() < skillReq) {
                await logger.warnOnce(target, `[${target}] Skipping hack: hacking skill too low.`);
                continue;
            } else {
                logger.reset(target);
            }
            const before = ns.getServerMoneyAvailable(target);
            try {
                const hacked = await ns.hack(target);
                const after = ns.getServerMoneyAvailable(target);
                const msg = `[${target}] Hacked: $${hacked.toLocaleString()} | Before: $${before.toLocaleString()} | After: $${after.toLocaleString()}`;
                ns.tprint(msg);
            } catch (hackErr) {
                const errStr = String(hackErr);
                if (errStr.includes("because your hacking skill is not high enough")) {
                    await logger.warnOnce(target, `[${target}] Skipping hack (runtime): hacking skill too low.`);
                    continue;
                } else {
                    await logger.error(`[${target}] Hack error: ${hackErr}`);
                }
            }
            await ns.sleep(100);
        }
        await ns.sleep(1000);
    }
}
