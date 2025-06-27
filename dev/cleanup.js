/**
 * cleanup.js - Bitburner script to kill all running scripts and delete all files in dev, prod, and logs directories except itself.
 * Usage: run this script from the home server.
 *
 * @param {NS} ns - Netscript API
 */
export async function main(ns) {
    // Kill all running scripts except this one
    const thisScript = ns.getScriptName();
    const allScripts = ns.ps("home");
    for (const proc of allScripts) {
        if (proc.filename !== thisScript) {
            ns.kill(proc.pid);
        }
    }

    // Helper to delete all files in a directory except cleanup.js
    function deleteFilesInDir(dir) {
        const files = ns.ls("home", dir + "/");
        for (const file of files) {
            if (file.endsWith("cleanup.js")) continue;
            ns.rm(file, "home");
        }
    }

    // Clean dev, prod, and logs directories
    deleteFilesInDir("dev");
    deleteFilesInDir("prod");
    deleteFilesInDir("logs");

    ns.tprint("Cleanup complete. All scripts killed and files deleted except cleanup.js.");
}
