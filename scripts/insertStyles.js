Hooks.on("init", () => console.log("APSJ Styles | Initializing"));

Hooks.on("renderJournalSheet", (_app, html) => {
  // Avoid adding the button twice
  if (html.find(".apsj-dropdown").length) return;

  const toolbar = html.find("div.journal-editor-toolbar");
  if (!toolbar.length) return;

  const template = `
    <select class="apsj-dropdown" style="margin-left:10px;">
      <option value="">APSJ Style</option>
      <option value="apsj-callout">Callout Box</option>
      <option value="apsj-note">Note Block</option>
      <option value="apsj-todo">Todo</option>
      <option value="apsj-highlight">Highlight</option>
      <option value="apsj-error">Error</option>
      <option value="apsj-success">Success</option>
      <option value="apsj-info">Info</option>
    </select>`;

  const dropdown = $(template).change((ev) => {
    const cls = ev.target.value;
    if (!cls) return;
    const editor = html.find("div.journal-editor")[0]._editor;
    editor.insertContent(`<div class="${cls}">Your text here</div><p><br/></p>`);
    ev.target.value = ""; // reset
  });

  toolbar.append(dropdown);
  console.log("APSJ Styles | Dropdown added to Journal toolbar");
});

