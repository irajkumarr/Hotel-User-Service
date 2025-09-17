const fs = require("fs");
const path = require("path");

async function clearOldCombinedLog(minutes = 15) {
  const logPath = path.join(__dirname, "../../combined.log");

  if (fs.existsSync(logPath)) {
    const stats = fs.statSync(logPath);
    const cutoff = Date.now() - minutes * 60 * 1000;

    if (stats.mtimeMs < cutoff) {
      // Empty the file instead of deleting
      fs.writeFileSync(logPath, "");
      return { cleared: true };
    }
  }

  return { cleared: false };
}

module.exports = { clearOldCombinedLog };
