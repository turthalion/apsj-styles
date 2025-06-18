export class APSJFontHelper {
    static loadFonts() {
        FontConfig.loadFont('Anglo Text', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/anglotext-webfont.woff2',
                    ],
                },
            ],
        });

        FontConfig.loadFont('Bookinsanity', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/Bookinsanity/Bookinsanity.otf',
                    ],
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/Bookinsanity/BookinsanityBold.otf',
                    ],
                    weight: 700,
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/Bookinsanity/BookinsanityBoldItalic.otf',
                    ],
                    weight: 700,
                    style: 'italic',
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/Bookinsanity/BookinsanityItalic.otf',
                    ],
                    style: 'italic',
                },
            ],
        });

        FontConfig.loadFont('DungeonDropCase', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/DungeonDropCase/DungeonDropCase.otf',
                    ],
                },
            ],
        });

        FontConfig.loadFont('Lovers Quarrel', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/loversquarrel-regular-webfont.woff2',
                    ],
                },
            ],
        });

        FontConfig.loadFont('Montserrat', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/Montserrat-Regular.woff2',
                    ],
                },
            ],
        });

        FontConfig.loadFont('MrEaves', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/MrEaves/MrEaves.otf',
                    ],
                },
            ],
        });

        FontConfig.loadFont('Play', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/Play-Regular.woff2',
                    ],
                },
            ],
        });

        FontConfig.loadFont('ScalySans', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySans.otf',
                    ],
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansBold.otf',
                    ],
                    weight: 700,
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansBoldItalic.otf',
                    ],
                    weight: 700,
                    style: 'italic',
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansItalic.otf',
                    ],
                    style: 'italic',
                },
            ],
        });

        FontConfig.loadFont('ScalySansCaps', {
            editor: true,
            fonts: [
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansCaps.otf',
                    ],
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansCapsBold.otf',
                    ],
                    weight: 700,
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansCapsBoldItalic.otf',
                    ],
                    style: 'italic',
                    weight: 700,
                },
                {
                    urls: [
                        'modules/apsj-styles/fonts/ScalySans/ScalySansCapsItalic.otf',
                    ],
                    style: 'italic',
                },
            ],
        });
    }
}
