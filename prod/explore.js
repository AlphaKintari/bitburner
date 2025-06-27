// explore.js - Recursively explores the Bitburner network, attempts to hack servers, and logs results

/** @param {NS} ns **/
export async function main(ns) {
    const visited = new Set();
    const route = [];
    const log = [];

    // List of available port openers
    const portOpeners = [
        { name: "BruteSSH.exe", fn: ns.brutessh },
        // Add more port openers here if you acquire them
    ];

    // Recursively explore the network
    async function explore(server, path) {
        visited.add(server);
        route.push(server);
        let hacked = false;
        let reason = "";

        if (!ns.hasRootAccess(server)) {
            // Try to open ports
            for (const opener of portOpeners) {
                if (ns.fileExists(opener.name, "home")) {
                    try { opener.fn(server); } catch {}
                }
            }
            try {
                ns.nuke(server);
            } catch {}
        }

        if (ns.hasRootAccess(server)) {
            hacked = true;
            reason = "Root access obtained.";
        } else {
            reason = "Could not gain root access.";
        }

        log.push({
            path: path.concat(server),
            server,
            hacked,
            reason
        });

        // Scan for neighbors and recurse
        for (const neighbor of ns.scan(server)) {
            if (!visited.has(neighbor)) {
                await explore(neighbor, path.concat(server));
            }
        }
    }

    await explore("home", []);

    // Prepare log output
    let logOutput = "";
    let hackedOutput = "";
    for (const entry of log) {
        const line =
            `[${entry.path.join(" -> ")}] | ${entry.server} | ` +
            (entry.hacked ? "HACKED" : "FAILED") +
            ` | ${entry.reason}\n`;
        logOutput += line;
        if (entry.hacked) {
            hackedOutput += `[${entry.path.join(" -> ")}] | ${entry.server}\n`;
        }
    }

    // Ensure logs directory exists
    const logsDir = "/logs";
    const logsExist = ns.ls("home").some(f => f.startsWith("/logs/"));
    if (!logsExist) {
        try { ns.mkdir(logsDir); } catch (e) { ns.tprint(`Failed to create logs directory: ${e}`); }
    }

    // Write log to files
    const logFile = "/logs/explore.txt";
    const hackedFile = "/logs/hacked.txt";
    await ns.write(logFile, logOutput, "w");
    await ns.write(hackedFile, hackedOutput, "w");
    ns.tprint(`Exploration log saved to ${logFile}`);
    ns.tprint(`Hacked server list saved to ${hackedFile}`);
}
