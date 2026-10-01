const REPO = "codeBilal-exe/FSWD-LAB", BRANCH = "main";
const TREE_CACHE_KEY = `fswd-lab-tree:${REPO}:${BRANCH}`;
let LABS = [], ALL = [];
const $ = id => document.getElementById(id);
const ext = f => f.split(".").pop(), base = f => f.split("/").pop();
const enc = p => p.split("/").map(encodeURIComponent).join("/");
const lang = f => ({ html: "xml", css: "css", js: "javascript" }[ext(f)] || "plaintext");
const cache = {}; let cur, curFile, idx = 0, compiledOutput = false;
const labLabel = name => name.replace(/^LAB-/i, "Lab ").replace(/-/g, " ").replace(/\s+/g, " ").trim();

/* Theme Switcher */
const root = document.documentElement;
root.dataset.theme = localStorage.getItem("t") || (matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark");
$("theme").onclick = () => { root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("t", root.dataset.theme) } catch (e) { } };

function readableName(path, directoryPageCount = 1) {
    const parts = path.split("/");
    const parent = parts[parts.length - 2] || "";
    let name = parts[parts.length - 1];
    if (/^index\.html?$/i.test(name) || (/^task[-_ ]*\d+/i.test(parent) && directoryPageCount === 1)) name = parent;
    else name = name.replace(/\.html?$/i, "");
    return name.replace(/^task[-_ ]*\d*[-_ ]*/i, "").replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Web Page";
}
function makeId(path) { return path.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

async function fetchJson(url, options = {}) {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
}
function flattenJsDelivrTree(entries, parent = "") {
    return (entries || []).flatMap(entry => {
        const path = parent ? `${parent}/${entry.name}` : entry.name;
        return entry.type === "directory" ? flattenJsDelivrTree(entry.files, path) : [{ type: "blob", path }];
    });
}
async function fetchRepositoryTree() {
    const errors = [];
    try {
        const tree = await fetchJson(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`, { headers: { Accept: "application/vnd.github+json" } });
        if (!Array.isArray(tree.tree)) throw new Error("GitHub returned an invalid repository tree.");
        try { localStorage.setItem(TREE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), tree: tree.tree })); } catch (_) { }
        return tree.tree;
    } catch (error) { errors.push(`GitHub API: ${error.message}`); }
    try {
        const listing = await fetchJson(`https://data.jsdelivr.com/v1/package/gh/${REPO}@${BRANCH}`);
        if (!Array.isArray(listing.files)) throw new Error("jsDelivr returned an invalid file listing.");
        const tree = flattenJsDelivrTree(listing.files);
        try { localStorage.setItem(TREE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), tree })); } catch (_) { }
        return tree;
    } catch (error) { errors.push(`jsDelivr: ${error.message}`); }
    try {
        const cached = JSON.parse(localStorage.getItem(TREE_CACHE_KEY) || "null");
        if (cached && Array.isArray(cached.tree)) return cached.tree;
    } catch (_) { }
    throw new Error(`Could not fetch the repository file list. ${errors.join("; ")}`);
}
async function discoverLabs() {
    const tree = await fetchRepositoryTree();
    const files = tree.filter(x => x.type === "blob").map(x => x.path);
    const folders = [...new Set(files.map(path => path.split("/")[0]).filter(name => /^LAB-\d+$/i.test(name)))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    LABS = folders.map(folder => {
        const labFiles = files.filter(path => path.startsWith(folder + "/"));
        const taskPages = labFiles.filter(path => /\.html?$/i.test(path) && !(path.split("/").length === 2 && /^index\.html?$/i.test(path.split("/").pop())));
        const labId = makeId(folder);
        const directPages = taskPages.filter(page => page.slice(0, page.lastIndexOf("/")) === folder);
        const taskDirs = [...new Set(taskPages.map(page => page.slice(0, page.lastIndexOf("/"))).filter(dir => dir !== folder))];
        const units = [
            ...directPages.map(page => ({ dir: folder, page, pages: [page] })),
            ...taskDirs.map(dir => {
                const taskFiles = taskPages.filter(page => page.slice(0, page.lastIndexOf("/")) === dir);
                const page = taskFiles.find(path => /^index\.html?$/i.test(base(path))) || taskFiles[0];
                return { dir, page, pages: taskFiles };
            })
        ];
        const directJs = labFiles.filter(file => file.slice(0, file.lastIndexOf("/")) === folder && /\.js$/i.test(file));
        if (!directPages.length) directJs.forEach(file => units.push({ dir: folder, page: null, pages: [], sourceFile: file }));
        const htmlDirs = new Set(taskPages.map(page => page.slice(0, page.lastIndexOf("/"))));
        const sourceDirs = [...new Set(labFiles
            .filter(file => /\.(css|js)$/i.test(file))
            .map(file => file.slice(0, file.lastIndexOf("/"))))]
            .filter(dir => dir !== folder && !htmlDirs.has(dir) &&
                !taskPages.some(page => page.startsWith(dir + "/")));
        sourceDirs.forEach(dir => units.push({ dir, page: null, pages: [] }));
        const items = units.map(unit => {
            const related = unit.sourceFile ? [unit.sourceFile] : labFiles.filter(file => file.slice(0, file.lastIndexOf("/")) === unit.dir && /\.(html?|css|js)$/i.test(file));
            if (unit.page && !related.includes(unit.page)) related.unshift(unit.page);
            const name = unit.page ? readableName(unit.page, unit.pages.length) : (unit.sourceFile ? base(unit.sourceFile).replace(/\.js$/i, "") : unit.dir.split("/").pop()).replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Source Files";
            const previewable = Boolean(unit.page);
            return { id: makeId(unit.page || unit.sourceFile || unit.dir), labId, name, desc: previewable ? `Live preview of ${name}. Use the source tabs to inspect all pages and assets in this task.` : `Source files for ${name}. Open the task to inspect its code.`, page: unit.page, files: related.sort((a, b) => a === unit.page ? -1 : b === unit.page ? 1 : a.localeCompare(b)) };
        });
        return { id: labId, group: labLabel(folder), sub: `${items.length} task${items.length === 1 ? "" : "s"}`, items };
    });
    ALL = LABS.flatMap(group => group.items);
    renderPortal();
    route();
}

function renderPortal() {
    if (!ALL.length) {
        $("gallery").innerHTML = `<div class="empty-state"><h2>No lab folders found</h2><p>Add files to a <code>LAB-1</code>, <code>LAB-2</code>, or similarly named folder, then push it to the configured GitHub branch.</p></div>`;
        return;
    }
    $("directory-head").hidden = true;
    $("gallery").innerHTML = `<div class="grp"><h2>Your Labs</h2><span>${LABS.length} lab${LABS.length === 1 ? "" : "s"}</span><i></i></div><div class="grid">` +
        LABS.map(group => `<a class="card lab-card" href="#${group.id}" aria-label="Open ${group.group}">
  <div class="window-bar"><span class="dot-btn r"></span><span class="dot-btn y"></span><span class="dot-btn g"></span><span class="window-title mono">${group.group}</span></div>
  <div class="body"><span class="lab-icon" aria-hidden="true">▤</span><h3>${group.group}</h3><p>Open this lab to browse its tasks and live previews.</p><div class="row"><span class="chip mono">${group.items.length} TASK${group.items.length === 1 ? "" : "S"}</span><span class="go">Open lab</span></div></div>
 </a>`).join("") + `</div>`;
    fit();
}
function renderTasks(group) {
    $("directory-head").hidden = false;
    $("directory-title").textContent = group.group;
    $("directory-subtitle").textContent = `${group.items.length} task${group.items.length === 1 ? "" : "s"} in this lab`;
    $("gallery").innerHTML = `<div class="grid">` + group.items.map(item => `<a class="card" href="#${item.id}" aria-label="${item.page ? "Preview" : "Inspect source for"} ${item.name}">
  <div class="window-bar"><span class="dot-btn r"></span><span class="dot-btn y"></span><span class="dot-btn g"></span><span class="window-title mono">${group.group} / ${item.name}</span></div>
  ${item.page ? `<div class="thumb"><iframe src="${enc(item.page)}" loading="lazy" tabindex="-1" title="${item.name} preview"></iframe></div>` : `<div class="thumb"><div class="source-only mono">Source files only</div></div>`}
  <div class="body"><h3>${item.name}</h3><p>${item.desc}</p><div class="row">${[...new Set(item.files.map(ext))].map(e => `<span class="chip mono ${e}">${e.toUpperCase()}</span>`).join("")}<span class="go">${item.page ? "Preview task" : "Inspect source"}</span></div></div>
 </a>`).join("") + `</div>`;
    fit();
}
discoverLabs().catch(error => {
    $("gallery").innerHTML = `<div class="empty-state"><h2>Could not load lab folders</h2><p>${error.message} Check your internet connection and reload this page.</p></div>`;
});
function fit() { document.querySelectorAll(".thumb").forEach(t => { const frame = t.querySelector("iframe"); if (frame) frame.style.transform = `scale(${t.clientWidth / 1280})` }) }
addEventListener("resize", fit);

/* Detail View Loading Logic */
async function source(f) {
    if (cache[f] != null) return cache[f];
    for (const u of [enc(f), `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/${enc(f)}`, `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${enc(f)}`]) {
        try { const r = await fetch(u); if (r.ok) return cache[f] = await r.text() } catch (e) { }
    }
    throw new Error("Could not load " + f);
}
async function showFile(f) {
    curFile = f;
    document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("act", b.dataset.f === f));
    $("bCompile").hidden = !/\.js$/i.test(f);
    $("path").textContent = f; $("gh").href = `https://github.com/${REPO}/blob/${BRANCH}/${enc(f)}`;
    const el = $("src"); el.textContent = "Loading source…";
    try {
        const t = await source(f); if (f !== curFile) return;
        if (!t.trim()) { el.textContent = "// File is empty"; return }
        const h = window.hljs ? hljs.highlight(t, { language: lang(f), ignoreIllegals: true }).value : t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
        el.innerHTML = h.split("\n").map((l, i) => `<span class="ln" data-n="${i + 1}">${l}</span>`).join("");
    } catch (e) { el.innerHTML = `<div class="err">${e.message}</div>` }
}
function setView(v) {
    if (!cur?.page && !compiledOutput) v = "code";
    $("bPrev").classList.toggle("on", v === "prev"); $("bCode").classList.toggle("on", v === "code");
    $("frame").style.display = v === "prev" ? "block" : "none"; $("code").style.display = v === "code" ? "flex" : "none";
    $("dev").style.visibility = v === "prev" && cur?.page ? "visible" : "hidden";
    $("view").classList.toggle("preview-mode", v === "prev");
    $("view").classList.remove("toolbar-hidden");
    $("preview-toolbar").classList.remove("is-hidden");
    if (v === "prev") hideToolbarLater(); else clearTimeout(toolbarTimer);
}

let toolbarTimer;
function revealToolbar() {
    clearTimeout(toolbarTimer);
    $("preview-toolbar").classList.remove("is-hidden");
    $("view").classList.remove("toolbar-hidden");
}
function hideToolbarLater() {
    clearTimeout(toolbarTimer);
    if (!$("view").classList.contains("preview-mode")) return;
    toolbarTimer = setTimeout(() => {
        const toolbar = $("preview-toolbar");
        if (toolbar.matches(":hover") || toolbar.contains(document.activeElement)) { hideToolbarLater(); return; }
        toolbar.classList.add("is-hidden");
        $("view").classList.add("toolbar-hidden");
    }, 2500);
}
$("preview-toolbar").addEventListener("pointerenter", revealToolbar);
$("preview-toolbar").addEventListener("pointerleave", hideToolbarLater);
$("preview-toolbar").addEventListener("focusin", revealToolbar);
$("preview-toolbar").addEventListener("focusout", hideToolbarLater);
$("view").addEventListener("pointermove", e => {
    if ($("view").classList.contains("toolbar-hidden") && e.clientY <= 12) revealToolbar();
});
$("view").addEventListener("pointerdown", e => {
    if ($("view").classList.contains("toolbar-hidden") && e.clientY <= 12) revealToolbar();
});
function open(id) {
    idx = ALL.findIndex(i => i.id === id); cur = ALL[idx];
    compiledOutput = false;
    $("home").style.display = "none"; $("view").style.display = "flex";
    $("title").textContent = cur.name;
    $("bPrev").disabled = !cur.page; $("bPrev").hidden = !cur.page;
    $("bCompile").hidden = !cur.files.some(file => /\.js$/i.test(file));
    $("frame").src = cur.page ? enc(cur.page) : "about:blank";
    $("frame").removeAttribute("sandbox");
    $("openTab").hidden = !cur.page;
    if (cur.page) $("openTab").href = enc(cur.page);
    $("tabs").innerHTML = cur.files.map(f => `<button data-f="${f}">${base(f)}</button>`).join("");
    setView(cur.page ? "prev" : "code"); showFile(cur.files[0]); scrollTo(0, 0);
}
function route() {
    const id = location.hash.slice(1);
    const task = ALL.find(i => i.id === id);
    if (task) { open(id); return; }
    clearTimeout(toolbarTimer);
    $("view").classList.remove("preview-mode", "toolbar-hidden");
    $("view").style.display = "none";
    $("home").style.display = "block";
    $("frame").src = "about:blank";
    const lab = LABS.find(group => group.id === id);
    if (lab) renderTasks(lab);
    else if (ALL.length) renderPortal();
}
const go = d => { location.hash = ALL[(idx + d + ALL.length) % ALL.length].id };
function updateAnalogClock() {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;
    const hourDeg = hours * 30;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;
    $("hour-hand").style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    $("minute-hand").style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    $("second-hand").style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
}
setInterval(updateAnalogClock, 1000);
updateAnalogClock();

$("back").onclick = () => location.hash = cur ? cur.labId : "";
$("prev").onclick = () => go(-1); $("next").onclick = () => go(1);
$("bPrev").onclick = () => { compiledOutput = false; $("frame").removeAttribute("sandbox"); $("frame").src = enc(cur.page); setView("prev") };
$("bCode").onclick = () => { compiledOutput = false; setView("code") };
$("bCompile").onclick = async () => {
    if (!curFile || !/\.js$/i.test(curFile)) return;
    $("bCompile").disabled = true;
    $("bCompile").textContent = "Running…";
    try {
        const js = await source(curFile);
        const safeSource = JSON.stringify(js).replace(/</g, "\\u003c");
        const runner = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#090a0d;color:#eceae5;font:14px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}header{color:#d4af37;font:600 11px/1.4 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:14px}pre{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:20px;border:1px solid rgba(212,175,55,.2);border-radius:10px;background:#11131a;min-height:80px}</style></head><body><header>JavaScript Console Output</header><pre id="output">Running ${curFile.replace(/[&<>"']/g, "")}…</pre><script>
const output=document.getElementById("output"), lines=[];
const format=value=>{if(typeof value==="string")return value;try{const json=JSON.stringify(value,null,2);return json===undefined?String(value):json}catch(_){return String(value)}};
const render=()=>{output.textContent=lines.length?lines.join("\\n"):"Execution completed with no console output."};
["log","info","warn","error","debug"].forEach(method=>console[method]=(...args)=>{lines.push(args.map(format).join(" "));render()});
console.clear=()=>{lines.length=0;render()};
window.onerror=(message,_source,line,column,error)=>{lines.push("Error: "+(error&&error.stack?error.stack:message+" (line "+line+":"+column+")"));render();return true};
window.addEventListener("unhandledrejection",event=>{lines.push("Error: "+format(event.reason));render()});
try{const task=document.createElement("script");task.textContent=${safeSource};document.body.appendChild(task);render()}catch(error){lines.push("Error: "+(error.stack||error));render()}
<\/script></body></html>`;
        compiledOutput = true;
        $("frame").setAttribute("sandbox", "allow-scripts");
        $("frame").srcdoc = runner;
        setView("prev");
    } catch (error) {
        const safeError = String(error.message || error).replace(/[&<>]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]);
        compiledOutput = true;
        $("frame").setAttribute("sandbox", "allow-scripts");
        $("frame").srcdoc = `<pre style="padding:24px;color:#fca5a5;background:#090a0d;font:14px/1.6 monospace">${safeError}</pre>`;
        setView("prev");
    } finally {
        $("bCompile").disabled = false;
        $("bCompile").textContent = "▶ Compile";
    }
};
$("tabs").onclick = e => {
    if (!e.target.dataset.f) return;
    compiledOutput = false;
    setView("code");
    showFile(e.target.dataset.f);
};
$("dev").onclick = e => {
    const d = e.target.dataset.d; if (d === undefined) return;
    $("frame").className = "frame " + d; document.querySelectorAll("#dev button").forEach(b => b.classList.toggle("on", b === e.target))
};
$("copy").onclick = async e => { try { await navigator.clipboard.writeText(cache[curFile] || ""); e.target.textContent = "Copied ✓" } catch (_) { e.target.textContent = "Failed" } setTimeout(() => e.target.textContent = "Copy", 1400) };
addEventListener("hashchange", route);
route(); fit(); addEventListener("load", fit);
