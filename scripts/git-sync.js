const simpleGit = require('simple-git');
const path = require('path');

const REPO_DIR = path.join(__dirname, '..');
const AUTO_PUSH = process.env.GIT_AUTO_PUSH === 'true';
const AUTHOR_NAME = process.env.GIT_AUTHOR_NAME || 'Dokter Richard CMS';
const AUTHOR_EMAIL = process.env.GIT_AUTHOR_EMAIL || 'cms@dokterrichard.nl';
const BRANCH = process.env.GIT_BRANCH || 'main';

const git = simpleGit(REPO_DIR);

async function ensureReady() {
  if (!AUTO_PUSH) return { enabled: false };
  try {
    await git.raw(['config', 'user.name', AUTHOR_NAME]);
    await git.raw(['config', 'user.email', AUTHOR_EMAIL]);
    return { enabled: true };
  } catch (err) {
    console.error('[git-sync] Config fout:', err.message);
    return { enabled: false, error: err.message };
  }
}

// Queue zodat meerdere saves in volgorde gepusht worden
let queue = Promise.resolve();

function sync(message, files = []) {
  if (!AUTO_PUSH) return Promise.resolve({ skipped: true });

  const task = async () => {
    try {
      // Eerst pullen zodat we niet achterlopen
      await git.fetch('origin', BRANCH).catch(() => {});
      await git.pull('origin', BRANCH, { '--rebase': 'true' }).catch(err => {
        console.warn('[git-sync] Pull waarschuwing:', err.message);
      });

      // Alleen relevante bestanden staged
      if (files.length) {
        for (const f of files) {
          await git.add(f).catch(() => {});
        }
      } else {
        // Fallback: alle wijzigingen behalve genegeerde dingen
        await git.add(['.']);
      }

      const status = await git.status();
      if (!status.staged.length && !status.created.length && !status.deleted.length && !status.modified.length) {
        return { skipped: true, reason: 'geen wijzigingen' };
      }

      await git.commit(message, undefined, {
        '--author': `${AUTHOR_NAME} <${AUTHOR_EMAIL}>`
      });

      await git.push('origin', BRANCH);

      return { success: true, message };
    } catch (err) {
      console.error('[git-sync] Fout bij syncen:', err.message);
      return { success: false, error: err.message };
    }
  };

  queue = queue.then(task, task);
  return queue;
}

// Start-up: config klaarzetten
ensureReady().then(r => {
  if (r.enabled) console.log('[git-sync] Auto-push aan (branch:', BRANCH + ')');
  else console.log('[git-sync] Auto-push uit (GIT_AUTO_PUSH=true om te activeren)');
});

module.exports = { sync, isEnabled: () => AUTO_PUSH };
