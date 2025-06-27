/**
 * status.js - Displays a floating window with the status of all running scripts on home.
 * Shows money, security, and last log line for each process's target server if possible.
 * @param {NS} ns
 */
export async function main(ns) {
    if (ns.ui && ns.ui.openTail) {
        ns.ui.openTail("status.js"); // Open a floating window using the new API
    }
    while (true) {
        ns.clearLog();
        const processes = ns.ps("home");
        ns.print("PID\tThreads\tRAM\tFilename\tArgs\tMoney\tSecurity\tLast Log");
        for (const proc of processes) {
            // Try to get the target server from args (first arg)
            let target = proc.args && proc.args.length > 0 ? proc.args[0] : null;
            let money = "-";
            let security = "-";
            if (target && ns.serverExists(target)) {
                try {
                    money = ns.nFormat(ns.getServerMoneyAvailable(target), "$0.00a");
                    security = ns.getServerSecurityLevel(target).toFixed(2);
                } catch {}
            }
            // Get last log line for this process
            let lastLog = "-";
            try {
                const logs = ns.getScriptLogs(proc.filename, "home", ...proc.args);
                if (logs && logs.length > 0) {
                    lastLog = logs[logs.length - 1].replace(/\t/g, " ").slice(0, 40);
                }
            } catch {}
            ns.print(`${proc.pid}\t${proc.threads}\t${ns.getScriptRam(proc.filename)}GB\t${proc.filename}\t${proc.args.join(" ")}\t${money}\t${security}\t${lastLog}`);
        }
        await ns.sleep(1000);
    }
}
