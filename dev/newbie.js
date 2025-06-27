// attack.js - A simple Bitburner script to grow money on both n00dles and foodnstuff servers

/** @param {NS} ns **/
export async function main(ns) {
    const targets = ["n00dles", "foodnstuff"];
    while (true) {
        for (const target of targets) {
            if (!ns.hasRootAccess(target)) {
                // Try to open ports using available programs
                if (ns.fileExists("BruteSSH.exe", "home")) ns.brutessh(target);
                if (ns.fileExists("FTPCrack.exe", "home")) ns.ftpcrack(target);
                if (ns.fileExists("relaySMTP.exe", "home")) ns.relaysmtp(target);
                if (ns.fileExists("HTTPWorm.exe", "home")) ns.httpworm(target);
                if (ns.fileExists("SQLInject.exe", "home")) ns.sqlinject(target);
                try {
                    ns.nuke(target);
                } catch (e) {
                    ns.tprint(`Failed to nuke ${target}: ${e}`);
                }
            }
            if (!ns.hasRootAccess(target)) {
                ns.tprint(`Skipping ${target}: no root access.`);
                continue;
            }
            await ns.grow(target);
            await ns.hack(target);
            await ns.weaken(target);
        }
    }
}

