export let i18n = key => {
    return game.i18n.localize(key);
};
export let format = (key, data = {}) => {
    return game.i18n.format(key, data);
};
export let log = (...args) => console.log("apsj-styles | ", ...args);

export const registerSettings = function () {
  // Register any custom module settings here
  let modulename = "apsj-styles";

  let apsjThemes = {
    'none': i18n('APSJournal.color-theme-none.name'),
    'blue':  i18n('APSJournal.color-theme-blue.name'),
    'cyan':  i18n('APSJournal.color-theme-cyan.name'),
    'green':  i18n('APSJournal.color-theme-green.name'),
    'orange':  i18n('APSJournal.color-theme-orange.name'),
    'purple':  i18n('APSJournal.color-theme-purple.name'),
    'red': i18n('APSJournal.color-theme-red.name'),
    'yellow':  i18n('APSJournal.color-theme-yellow.name')
  };

  game.settings.register(modulename, 'apsj-theme', {
    name: i18n('APSJournal.apsj-theme.name'),
    hint: i18n('APSJournal.apsj-theme.hint'),
    scope: 'client',
    config: true,
    default: "none",
    choices: apsjThemes,
    type: String,
    onChange: (value) => {
      document.documentElement.setAttribute("apsj-theme", value);
    },
  });
}

const APSJ_STYLE_BLOCKS = {
  apsjTitle: { class: "apsj-title", type: "heading", text: "text-heading-title" },
  apsjHeading: { class: "apsj-heading", type: "heading", text: "text-heading" },
  apsjDataHeading: { class: "apsj-data-heading", type: "heading", text: "text-data-heading" },
  apsjData: { class: "apsj-data", type: "paragraph", text: "text-data" },
  apsjText: { class: "apsj-text", type: "paragraph", text: "text-paragraph" },
};

export class APSJ {
    static blockList = [
        'black',
        'blue',
        'cyan',
        'green',
        'orange',
        'purple',
        'red',
        'yellow',
        'card',
        'scroll',
        'encounter',
        'read-aloud',
    ];
    static dialogList = [
        'black',
        'blue',
        'cyan',
        'green',
        'orange',
        'purple',
        'red',
        'yellow',
    ];
    static panelList = [
        'bonus',
        'effect',
        'info',
        'loot',
        'note',
        'trap',
        'warning',
        'blue',
        'cyan',
        'green',
        'orange',
        'purple',
        'red',
        'yellow',
    ];
    static readAloudList = [
        'black',
        'blue',
        'cyan',
        'green',
        'orange',
        'purple',
        'red',
        'yellow',
    ];

    static async init() {
        log('Initializing apsj-styles');
        registerSettings();
        const value = game.settings.get("apsj-styles", "apsj-theme");
        document.documentElement.setAttribute("apsj-theme", value);
    }

    /**
     * Change to the selected theme in local storage
     **/
    static setTheme(theme) {
        if (theme == 'none')
            document.documentElement.removeAttribute('apsj-theme');
        else
            document.documentElement.setAttribute('apsj-theme', theme);
    }

    /**
     * Define HTML Elements for Blocks
     **/

    static async getBlock(colour) {
        if (['card', 'scroll', 'encounter', 'read-aloud'].includes(colour)) {
            let content = await foundry.applications.handlebars.renderTemplate(
                `modules/apsj-styles/templates/${colour}.html`
            );
            return content;
        } else {
            let data = {
                colour: colour,
                overlay: colour === 'black' ? 'light-overlay' : colour,
                header: i18n(`APSJournal.block-${colour}.heading`),
                body: i18n(`APSJournal.block-${colour}.body`),
            };

            let content = await foundry.applications.handlebars.renderTemplate(
                'modules/apsj-styles/templates/block.html',
                data
            );
            return content;
        }
    }

    static async getDialog(colour, side) {
        let content = await foundry.applications.handlebars.renderTemplate(
            'modules/apsj-styles/templates/dialog.html',
            { colour, side }
        );
        return content;
    }

    static async getPanel(colour) {
        let data = {
            heading: i18n(`APSJournal.panel-${colour}.heading`),
            icon: [
                'bonus',
                'effect',
                'info',
                'loot',
                'note',
                'trap',
                'warning',
            ].includes(colour),
        };

        switch (colour) {
            case 'bonus':
                data.colour = 'cyan';
                break;
            case 'effect':
                data.colour = 'purple';
                break;
            case 'info':
                data.colour = 'blue';
                break;
            case 'loot':
                data.colour = 'green';
                break;
            case 'note':
                data.colour = 'yellow';
                break;
            case 'trap':
                data.colour = 'orange';
                break;
            case 'warning':
                data.colour = 'red';
                break;
            default:
                data.colour = colour;
                break;
        }

        let content = await foundry.applications.handlebars.renderTemplate(
            'modules/apsj-styles/templates/panel.html',
            data
        );
        return content;
    }

    static async getReadAloud(colour) {
        let data = {
            colour: colour,
            //overlay: colour === 'black' ? 'light-overlay' : colour,
            body: i18n(`APSJournal.block-read-aloud.body`),
        };

        let content = await foundry.applications.handlebars.renderTemplate(
            'modules/apsj-styles/templates/read-aloud-colour.html',
            data
        );
        return content;
    }
}

Hooks.once("init", async function () {
    APSJ.init();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "modules/apsj-styles/styles/apsj.css";
    document.head.appendChild(link);

});

function insertHTML(view, htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const fragment = ProseMirror.DOMParser.fromSchema(view.state.schema).parseSlice(doc.body);
  const transaction = view.state.tr.replaceSelection(fragment);
  view.dispatch(transaction);
}

Hooks.once("ready", async function () {
    Hooks.callAll("apsjReady");
});


Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  dropdowns.apsjStylish = {
    title: i18n("APSJournal.stylish-menu.name"),
    action: "stylish",
    entries: [
      {
        title: "Blocks",
        action: "blocks",
        children: APSJ.blockList.map((c) => ({
          title: i18n(`APSJournal.block-${c}.name`),
          description: i18n(`APSJournal.block-${c}.description`),
          action: `block-${c}`,
          cmd: async () => {
            const html = await APSJ.getBlock(c);
            insertHTML(proseMirrorMenu.view, html);
          },
        })),
      },
      {
        title: "Dialogues",
        action: "dialogues",
        children: APSJ.dialogList.flatMap((c) =>
          ["left", "right"].map((side) => ({
            title: i18n(`APSJournal.block-dialogue-${c}-${side}.name`),
            description: i18n(`APSJournal.block-dialogue.description`),
            action: `dialog-${c}-${side}`,
            cmd: async () => {
              const html = await APSJ.getDialog(c, side);
              insertHTML(proseMirrorMenu.view, html);
            },
          }))
        ),
      },
      {
        title: "Panels",
        action: "panels",
        children: APSJ.panelList.map((c) => ({
          title: i18n(`APSJournal.panel-${c}.name`),
          description: i18n(`APSJournal.panel-${c}.description`),
          action: `panel-${c}`,
          cmd: async () => {
            const html = await APSJ.getPanel(c);
            insertHTML(proseMirrorMenu.view, html);
          },
        })),
      },
      {
        title: "Read Aloud",
        action: "read-aloud",
        children: APSJ.readAloudList.map((c) => ({
          title: i18n(`APSJournal.block-read-aloud-${c}.name`),
          description: i18n(`APSJournal.block-read-aloud.description`),
          action: `read-aloud-${c}`,
          cmd: async () => {
            const html = await APSJ.getReadAloud(c);
            insertHTML(proseMirrorMenu.view, html);
          },
        })),
      },
    ],
  };
  const createStyleEntry = (key, config) => {
    const localizedText = i18n(`APSJournal.${config.text}.name`);

    // Wrap the localized text in a span with the config class
    const htmlTitle = `<span class="${config.class}">${localizedText}</span>`;

    return {
      title: htmlTitle,
      action: key,
      node: proseMirrorMenu.schema.nodes[config.type],
      attrs: { class: config.class },
      cmd: () => {
        const { view, schema } = proseMirrorMenu;
        const type = schema.nodes[config.type];
        const attrs = {
          _preserve: { class: config.class },
          ...(config.level ? { level: config.level } : {}),
        };
        const command = foundry.prosemirror.commands.setBlockType(type, attrs);
        command(view.state, view.dispatch);
      },
    };
  };

  // If the "format" dropdown exists, add our entries to it
  if (dropdowns.format?.entries) {
    dropdowns.format.entries.push({
      title: i18n("APSJournal.stylish-text-menu.name"),
      action: "apsjStyles",
      children: Object.entries(APSJ_STYLE_BLOCKS).map(([key, config]) =>
        createStyleEntry(key, config)
      ),
    });
  }
});
