// update-program-list.js - Updates copilot-availableprograms.md with current programs
/** @param {NS} ns **/
export async function main(ns) {
    const txtFile = "_CoPilot/copilot-availableprograms.txt";
    const knownPrograms = [
        "NUKE.exe", "BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe",
        "DeepscanV1.exe", "DeepscanV2.exe", "ServerProfiler.exe", "AutoLink.exe", "Formulas.exe"
    ];
    let available = [];
    for (const prog of knownPrograms) {
        if (ns.fileExists(prog, "home")) available.push(prog);
    }
    // Write a markdown-formatted list to a .txt file for reference
    let content = `# GitHub Copilot Bitburner List of available programs\n\n`;
    content += `Programs:\n`;
    for (const prog of available) {
        content += `    - ${prog}\n`;
    }
    await ns.write(txtFile, content, "w");
    ns.tprint(`[UPDATE] copilot-availableprograms.txt updated with: ${available.join(", ")}`);
}
