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

    static async init() {
        log('Initializing apsj-styles');
        registerSettings();
        const value = game.settings.get("apsj-styles", "apsj-theme");
        document.documentElement.setAttribute("apsj-theme", value);
    }

    static async ready() {
        console.log("APSJ ready: translations are now available");

        CONFIG.TinyMCE.style_formats ??= []; // safe guard

        CONFIG.TinyMCE.content_css.push(
            'modules/apsj-styles/styles/apsj.css'
        );

        CONFIG.TinyMCE.style_formats.push({
            title: i18n('APSJournal.stylish-text-menu.name'),
            items: [
                {
                    title: i18n('APSJournal.text-heading-title.name'),
                    selector: 'h1,h2,h3,h4,h5,h6,th,td,p',
                    classes: 'apsj-title',
                },
                {
                    title: i18n('APSJournal.text-heading.name'),
                    selector: 'h1,h2,h3,h4,h5,h6,th,td,p',
                    classes: 'apsj-heading',
                },
                {
                    title: i18n('APSJournal.text-data-heading.name'),
                    selector: 'h1,h2,h3,h4,h5,h6,th,td,p',
                    classes: 'apsj-data-heading',
                },
                {
                    title: i18n('APSJournal.text-data.name'),
                    selector: 'h1,h2,h3,h4,h5,h6,th,td,p',
                    classes: 'apsj-data',
                },
                {
                    title: i18n('APSJournal.text-paragraph.name'),
                    selector: 'td,p',
                    classes: 'apsj-text',
                },
            ],
        });

        CONFIG.TinyMCE.templates = (CONFIG.TinyMCE.templates || [])
            .concat(
                await Promise.all(
                    APSJ.blockList.map(async (c) => {
                        return {
                            title: i18n(`APSJournal.block-${c}.name`),
                            description: i18n(
                                `APSJournal.block-${c}.description`
                            ),
                            content: await APSJ.getBlock(c),
                        };
                    })
                )
            )
            .concat(
                ...(await Promise.all(
                    APSJ.dialogList.flatMap(async (c) => {
                        return await Promise.all(
                            ['left', 'right'].map(async (s) => {
                                return {
                                    title: i18n(
                                        `APSJournal.block-dialogue-${c}-${s}.name`
                                    ),
                                    description: i18n(
                                        'APSJournal.block-dialogue.description'
                                    ),
                                    content: await APSJ.getDialog(c, s),
                                };
                            })
                        );
                    })
                ))
            )
            .concat(
                await Promise.all(
                    APSJ.panelList.map(async (c) => {
                        return {
                            title: i18n(`APSJournal.panel-${c}.name`),
                            description: i18n(
                                `APSJournal.panel-${c}.description`
                            ),
                            content: await APSJ.getPanel(c),
                        };
                    })
                )
            );
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
}

export class APSJMenu extends ProseMirror.ProseMirrorMenu {
    addElement(htmlString) {
        const parser = ProseMirror.DOMParser.fromSchema(
            ProseMirror.defaultSchema
        );

        const node = ProseMirror.dom.parseString(htmlString);
        const state = this.view.state;
        const { $cursor } = state.selection;
        const tr = state.tr.insert($cursor.pos, node.content);
        const pos = $cursor.pos;// + node.nodeSize;

        tr.setSelection(ProseMirror.TextSelection.create(tr.doc, pos));
        this.view.dispatch(tr);
    }

    _getDropDownMenus() {
        const menus = super._getDropDownMenus();
        // menus.format.entries.push({
        //     action: 'stylishText',
        //     title: 'Stylish Text',
        //     children: [
        //         {
        //             action: 'stylishTitle',
        //             title: i18n(
        //                 'APSJournal.text-heading-title.name'
        //             ),
        //             priority: 1,
        //             style: "font-family: 'Modesto Condensed'",
        //             node: ProseMirror.defaultSchema.nodes.paragraph,
        //             cmd: () => {},
        //         },
        //         {
        //             action: 'stylishHeading',
        //             title: i18n('APSJournal.text-heading.name'),
        //             priority: 1,
        //             style: "font-family: 'ScalySansCaps'",
        //             node: ProseMirror.defaultSchema.nodes.paragraph,
        //         },
        //         {
        //             action: 'stylishDataHeading',
        //             title: i18n(
        //                 'APSJournal.text-data-heading.name'
        //             ),
        //             priority: 1,
        //             style: "font-family: 'ScaySansCaps'",
        //             node: ProseMirror.defaultSchema.nodes.paragraph,
        //         },
        //         {
        //             action: 'stylishData',
        //             title: i18n('APSJournal.text-data.name'),
        //             priority: 1,
        //             style: "font-family: 'ScalySans'",
        //             node: ProseMirror.defaultSchema.nodes.paragraph,
        //         },
        //         {
        //             action: 'stylishParagraph',
        //             title: i18n('APSJournal.text-paragraph.name'),
        //             priority: 1,
        //             style: "font-family: 'Bookinsanity'",
        //             node: ProseMirror.defaultSchema.nodes.paragraph,
        //         },
        //     ],
        // });

        menus.stylish = {
            title: i18n('APSJournal.stylish-menu.name'),
            entries: [
                {
                    action: 'blocks',
                    title: 'Blocks',
                    children: APSJ.blockList.map((c) => {
                        return {
                            action: `${c}Block`,
                            title: i18n(`APSJournal.block-${c}.name`),
                            cmd: async () => {
                                this.addElement(await APSJ.getBlock(c));
                            },
                        };
                    }),
                },
                {
                    action: 'dialogues',
                    title: 'Dialogues',
                    children: APSJ.dialogList.flatMap((c) => {
                        return ['left', 'right'].map((s) => {
                            return {
                                action: `${c}Dialogue${s}`,
                                title: i18n(
                                    `APSJournal.block-dialogue-${c}-${s}.name`
                                ),
                                cmd: async () => {
                                    this.addElement(await APSJ.getDialog(c, s));
                                },
                            };
                        });
                    }),
                },
                {
                    action: 'panels',
                    title: 'Panels',
                    children: APSJ.panelList.map((c) => {
                        return {
                            action: `${c}Panel`,
                            title: i18n(`APSJournal.panel-${c}.name`),
                            cmd: async () => {
                                this.addElement(await APSJ.getPanel(c));
                            },
                        };
                    }),
                },
            ],
        };
        return menus;
    }
}

Hooks.once("init", async function () {
    APSJ.init();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "modules/apsj-styles/styles/apsj.css";
    document.head.appendChild(link);

});

Hooks.once("ready", async function () {
    APSJ.ready();
    Hooks.callAll("apsjReady");
});

Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, dropdowns) => {
  console.log("proseMirror heading attrs:", proseMirrorMenu.schema.nodes.heading.spec.attrs);
  console.log("proseMirror paragraph attrs:", proseMirrorMenu.schema.nodes.paragraph.spec.attrs);
  const createStyleEntry = (key, config) => {
    const localizedText = i18n(`APSJournal.${config.text}.name`);

    // Wrap the localized text in a span with the config class
    const htmlTitle = `<span class="${config.class}">${localizedText}</span>`;
    console.log("config.class is ", config.class)
    console.log("htmlTitle is ", htmlTitle)

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
      title: i18n("APSJournal.stylish-menu.name"),
      action: "apsjStyles",
      children: Object.entries(APSJ_STYLE_BLOCKS).map(([key, config]) =>
        createStyleEntry(key, config)
      ),
    });
  }
});
