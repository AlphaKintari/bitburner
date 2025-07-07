/**
 * logger.js - Utility for logging and suppressing repeated warnings/errors
 * @param {NS} ns
 * @param {string} logFile
 */
export class Logger {
    constructor(ns, logFile) {
        this.ns = ns;
        this.logFile = logFile;
        this.warned = {};
    }
    /**
     * Log a warning only once per key (per run)
     * @param {string} key - Unique identifier (e.g., server name)
     * @param {string} msg - Warning message
     */
    async warnOnce(key, msg) {
        if (!this.warned[key]) {
            // Use tprint for visibility if running in terminal, else print
            if (this.ns.isRunning && this.ns.pid === 1) {
                this.ns.tprint(msg);
            } else {
                this.ns.print(msg);
            }
            await this.ns.write(this.logFile, msg + "\n", "a");
            this.warned[key] = true;
        }
    }
    /**
     * Log an error always (prints to both terminal and log file)
     * @param {string} msg - Error message
     */
    async error(msg) {
        this.ns.tprint(msg);
        await this.ns.write(this.logFile, msg + "\n", "a");
    }
    /**
     * Reset warning for a key (allows warning to be shown again)
     * @param {string} key - Unique identifier
     */
    reset(key) {
        this.warned[key] = false;
    }
}
