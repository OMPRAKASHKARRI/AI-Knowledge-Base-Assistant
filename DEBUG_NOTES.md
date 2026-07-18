# Debug Notes

Three real issues encountered while building this project, documented as they happened.

---

## Issue 1: `mkdir -p` with brace expansion silently created the wrong folders

**Problem**
The very first scaffolding command was:
```bash
mkdir -p backend/src/{config,models,controllers,routes,middleware,services,utils,uploads}
```
Expected: eight subdirectories. Listing the tree afterward showed a single literal directory named `{config,models,controllers,routes,middleware,services,utils,uploads}` instead.

**Root cause**
The command executor runs shell commands non-interactively, and in this context brace expansion (a Bash-specific feature) wasn't applied — the string was passed through to `mkdir` verbatim rather than being expanded into eight separate arguments first. This is a classic "works in my local terminal, not in a script/CI context" trap, since most developers test brace expansion in an interactive Bash shell where it always works.

**Investigation**
Ran `find . | sort` immediately after the `mkdir` to verify the actual result, rather than trusting the command's exit code (which was `0` — it "succeeded," just not at the intended task). This is what surfaced the mismatch between intent and outcome.

**Solution**
Replaced the single brace-expansion command with eight explicit `mkdir -p` calls, one per directory, which have no dependency on shell-specific expansion behavior. Removed the incorrectly named literal directory first with `rm -rf`.

**Takeaway**: verify side-effecting shell commands by inspecting the actual filesystem state afterward, don't infer success from exit code alone — especially for any syntax (brace expansion, glob patterns, `~` expansion) that varies between shells.

---

## Issue 2: `require()` used inside an ES Module config file

**Problem**
While wiring in `@tailwindcss/typography` (needed for the `prose` classes used in the markdown-rendered chat answers and document previews), the plugin was added as:
```js
plugins: [require('@tailwindcss/typography')],
```
inside `tailwind.config.js`.

**Root cause**
`frontend/package.json` declares `"type": "module"`, which makes every `.js` file in the project an ES Module by default — including `tailwind.config.js`, which already used `export default { ... }` (ESM syntax). Mixing `require()` (CommonJS) into an ESM file throws `ReferenceError: require is not defined` at load time, since Node doesn't inject the CJS `require` binding into ESM scope.

**Investigation**
Caught by re-reading the file immediately after editing it (checking for internal consistency of module syntax) rather than assuming the edit was drop-in safe just because `require()` is the "usual" way plugins are added in a lot of older Tailwind config examples found in documentation and tutorials, which predate widespread ESM adoption.

**Solution**
Replaced with a top-level import:
```js
import typography from '@tailwindcss/typography';
// ...
plugins: [typography],
```

**Takeaway**: config files inherit the module system of the project (via `package.json#type`), not the module system implied by whatever tutorial or doc example you're copying from. Always check `type: "module"` before adding `require`/`module.exports` to any new config file.

---

## Issue 3: No outbound network access blocks build/runtime verification

**Problem**
After writing all backend and frontend code, an attempt to actually verify the build (`npm install`, then `npm run dev`/`npm run build`) was needed to catch integration bugs that static review can't — mismatched prop types resolved only at bundle time, a missing dependency, a Tailwind class that doesn't compile, etc.

**Root cause**
The development sandbox this project was built in has no outbound internet access. Confirmed directly: `npm install --dry-run` on the frontend returned `403 Forbidden` from the npm registry, and the environment's network configuration explicitly disables egress for the command execution tool. This isn't a bug in the generated code — it's an environment constraint that limits how much verification is possible before handing the project off.

**Investigation**
Rather than assume the code was fine because it "looked right," the limitation was made explicit: confirmed the exact failure mode (403, not a timeout or DNS error, meaning the request reached a policy gate) and checked what verification *was* still possible without network access — `node --check` for backend JS syntax validity, and manual cross-referencing of every import/export and API contract between the frontend and backend.

**Solution**
Two-part: (1) did everything possible without network access — syntax-checked all backend files, manually traced every frontend import against its actual export, and matched every API service call's URL/method/payload shape against the corresponding Express route and controller; (2) documented this gap explicitly (here, and in `AI_USAGE.md`) instead of presenting the project as fully verified, and made "run `npm install` and both dev servers locally first" the clearly-stated first step for whoever picks this up.

**Takeaway**: when a sandboxed environment can't fully verify a deliverable, the honest move is to state exactly what was and wasn't verified, and why — not to imply full verification happened. This also mirrors a real engineering situation (e.g. building against a locked-down CI runner or an air-gapped environment) where the same discipline applies.
