/**
 * Entry point: owns the app state and wires the UI modules to the core.
 * No module here stores or sends data. Everything lives in memory until refresh.
 */
import { redact } from "./core/index.js";
import { initCategoryToggles } from "./ui/category-toggles.js";
import { initEntriesTable } from "./ui/entries-table.js";
import { initInputPanel } from "./ui/input-panel.js";
import { initOutputPanel } from "./ui/output-panel.js";
import { initRestorePanel } from "./ui/restore-panel.js";
import { initSession } from "./ui/session.js";
import { initTheme } from "./ui/theme.js";

const keep = new Set(); // originals the user marked "not sensitive"

const input = initInputPanel(run);
const enabled = initCategoryToggles(run);
const output = initOutputPanel({
  onMaskSelection: (term) => { input.addOtherTerm(term); run(); },
});
const table = initEntriesTable({
  onKeep: (original) => { keep.add(original); run(); },
});
const restorePanel = initRestorePanel();

function run() {
  const text = input.getText();
  const result = redact(text, { ...input.getTermOptions(), categories: enabled, keep });
  output.render(result.text, Boolean(text));
  table.render(result.entries, Boolean(text));
  restorePanel.setEntries(result.entries);
}

initTheme();
initSession({
  hasData: () => Boolean(input.getText()) || restorePanel.hasText(),
  clearAll: () => { input.clear(); output.clear(); restorePanel.clear(); keep.clear(); },
});
