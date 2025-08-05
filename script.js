const htmlBtn = document.querySelector("#html");
const cssBtn = document.querySelector("#css");
const jsBtn = document.querySelector("#js");
const runBtn = document.querySelector("#run");

const htmlTextArea = document.querySelector("#htmlTextArea");
const cssTextArea = document.querySelector("#cssTextArea");
const jsTextArea = document.querySelector("#jsTextArea");
const res = document.querySelector("#result");

htmlTextArea.value = "<h1>Hello World</h1>";
cssTextArea.value = "h1 { color: red; text-align: center; }";
jsTextArea.value = "console.log('Hello from JS');";

const htmlTags = [
  "a", "abbr", "address", "area", "article", "aside", "audio",
  "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button",
  "canvas", "caption", "cite", "code", "col", "colgroup",
  "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt",
  "em", "embed", "fieldset", "figcaption", "figure", "footer", "form",
  "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html",
  "i", "iframe", "img", "input", "ins",
  "kbd", "label", "legend", "li", "link",
  "main", "map", "mark", "meta", "meter",
  "nav", "noscript", "object", "ol", "optgroup", "option", "output",
  "p", "param", "picture", "pre", "progress",
  "q", "rp", "rt", "ruby",
  "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup",
  "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track",
  "u", "ul", "var", "video", "wbr"
];

const dropdown = document.createElement("div");
Object.assign(dropdown.style, {
  position: "absolute",
  background: "white",
  border: "1px solid gray",
  fontFamily: "monospace",
  fontSize: "14px",
  zIndex: 1000,
  display: "none",
  maxHeight: "150px",
  overflowY: "auto",
  padding: "5px",
  color:"black"
});
document.body.appendChild(dropdown);

let currentSuggestions = [];
let selectedIndex = -1;

htmlTextArea.addEventListener("input", (e) => {
  const cursorPos = e.target.selectionStart;
  const textBeforeCursor = e.target.value.slice(0, cursorPos);
  const match = textBeforeCursor.match(/<(\w*)$/);

  if (match) {
    const fragment = match[1];
    const filtered = htmlTags.filter((tag) => tag.startsWith(fragment));

    if (filtered.length) {
      showDropdown(filtered, fragment);
      positionDropdown(htmlTextArea, cursorPos);
    } else {
      dropdown.style.display = "none";
    }
  } else {
    dropdown.style.display = "none";
  }
});

htmlTextArea.addEventListener("keydown", (e) => {
  if (dropdown.style.display === "none") return;

  if (e.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % currentSuggestions.length;
    updateActiveSuggestion();
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
    updateActiveSuggestion();
    e.preventDefault();
  } else if (e.key === "Enter" && selectedIndex !== -1) {
    insertTag(`${currentSuggestions[selectedIndex]}></${currentSuggestions[selectedIndex]}>`);
    e.preventDefault();
  } else if (e.key === "Escape") {
    dropdown.style.display = "none";
  }
});

function insertTag(tag) {
  const pos = htmlTextArea.selectionStart;
  const value = htmlTextArea.value;
  const before = value.slice(0, pos).replace(/<\w*$/, `<${tag}`);
  const after = value.slice(pos);
  htmlTextArea.value = before + after;
  htmlTextArea.focus();
  htmlTextArea.selectionStart = htmlTextArea.selectionEnd = before.length;
  dropdown.style.display = "none";
}

function showDropdown(suggestions, currentFragment) {
  dropdown.innerHTML = "";
  currentSuggestions = suggestions;
  selectedIndex = -1;

  suggestions.forEach((tag, idx) => {
    const item = document.createElement("div");
    item.textContent = tag;
    item.style.padding = "2px 6px";
    item.style.cursor = "pointer";

    item.addEventListener("click", () => insertTag(tag));
    item.addEventListener("mouseover", () => {
      selectedIndex = idx;
      updateActiveSuggestion();
    });

    dropdown.appendChild(item);
  });

  dropdown.style.display = "block";
}

function updateActiveSuggestion() {
  Array.from(dropdown.children).forEach((child, idx) => {
    child.style.background = idx === selectedIndex ? "#ddd" : "white";
  });
}

function positionDropdown(textarea, position) {
  const div = document.createElement("div");
  const style = getComputedStyle(textarea);
  for (const prop of style) {
    div.style[prop] = style[prop];
  }

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.width = textarea.offsetWidth + "px";
  div.style.height = "auto";

  const text = textarea.value.slice(0, position);
  const span = document.createElement("span");
  span.textContent = "\u200b"; // zero-width space

  div.textContent = text;
  div.appendChild(span);

  document.body.appendChild(div);
  const rect = span.getBoundingClientRect();
  const taRect = textarea.getBoundingClientRect();

  dropdown.style.left = taRect.left + rect.left - div.getBoundingClientRect().left + "px";
  dropdown.style.top = taRect.top + rect.top - div.getBoundingClientRect().top + 20 + "px";

  document.body.removeChild(div);
}

function showEditor(activeTextArea) {
  [htmlTextArea, cssTextArea, jsTextArea].forEach((ta) => {
    ta.classList.remove("active");
  });
  activeTextArea.classList.add("active");
}

htmlBtn.addEventListener("click", () => showEditor(htmlTextArea));
cssBtn.addEventListener("click", () => showEditor(cssTextArea));
jsBtn.addEventListener("click", () => showEditor(jsTextArea));

runBtn.addEventListener("click", () => {
  const htmlVal = htmlTextArea.value;
  const cssVal = cssTextArea.value;
  const jsVal = jsTextArea.value;

  res.innerHTML = "";
  res.innerHTML = htmlVal;

  const style = document.createElement("style");
  style.textContent = cssVal;
  res.appendChild(style);

 const oldScripts = res.querySelectorAll("script");
  oldScripts.forEach(script => script.remove());

  const script = document.createElement("script");
script.textContent = `(function() {
  ${jsVal}
})();`;
res.appendChild(script);

});
