/**
 * can-hack.js - Utility to check if a server is hackable
 * @param {NS} ns
 * @param {string} server
 * @returns {boolean} True if server can be hacked (root, money, skill)
 */
export function canHack(ns, server) {
    if (!ns.hasRootAccess(server)) return false;
    if (ns.getServerMaxMoney(server) === 0) return false;
    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(server)) return false;
    return true;
}
