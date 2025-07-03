// messenger.js - Automated AI message handler for Bitburner
/** @param {NS} ns **/
export async function main(ns) {
    ns.tail();
    const inbox = "logs/inbox.txt";
    const outbox = "logs/outbox.txt";
    let lastMsgCount = 0;
    ns.tprint("[MESSENGER] AI message handler started. Awaiting commands!");
    while (true) {
        let messages = [];
        if (ns.fileExists(inbox, "home")) {
            const content = ns.read(inbox);
            messages = content.split("\n").filter(line => line.trim().length > 0);
        }
        if (messages.length > lastMsgCount) {
            for (let i = lastMsgCount; i < messages.length; ++i) {
                const msg = messages[i];
                let response = "";
                // Basic command parsing
                if (/hello|hi|hey/i.test(msg)) {
                    response = "Hello, human! I am your Bitburner AI copilot.";
                } else if (/status/i.test(msg)) {
                    response = `[STATUS] Money: $${ns.nFormat(ns.getPlayer().money, '0.00a')}, Hacking: ${ns.getHackingLevel()}`;
                } else if (/joke/i.test(msg)) {
                    response = "Why do hackers love nature? Because it has the best 'root' access!";
                } else if (/hack (.+)/i.test(msg)) {
                    const target = msg.match(/hack (.+)/i)[1];
                    if (target.startsWith("pserv-")) {
                        response = `Cannot hack ${target} because it is your own server. Skipping!`;
                    } else {
                        response = `I'll try to hack ${target}! (Not really launching, but I could!)`;
                    }
                } else if (/create program (.+)/i.test(msg)) {
                    const progName = msg.match(/create program (.+)/i)[1].trim();
                    // Only allow .js or .txt for Bitburner
                    if (!/\.(js|txt)$/i.test(progName)) {
                        response = `Can only create .js or .txt files in Bitburner. Try again!`;
                    } else if (ns.fileExists(progName, "home")) {
                        response = `${progName} already exists!`;
                    } else {
                        await ns.write(progName, `// ${progName} - created by messenger\n`, "w");
                        response = `Created new program: ${progName}`;
                    }
                } else {
                    response = `I received: '${msg}'. Type 'status', 'joke', 'create program <name>.js', or 'hello'!`;
                }
                ns.tprint(`[MESSENGER] ${response}`);
                await ns.write(outbox, `[${new Date().toLocaleTimeString()}] ${response}\n`, "a");
            }
            lastMsgCount = messages.length;
        }
        await ns.sleep(1500);
    }
}
