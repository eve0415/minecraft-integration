export class Language {
    public readonly default: boolean;
    public readonly code: string;
    public readonly strings: MinecraftKey;

    public constructor(options: LanguageOptions) {
        this.default = options.default ?? false;
        this.code = options.code;
        this.strings = options.strings;
    }
}

interface LanguageOptions {
    default?: boolean
    code: string,
    strings: MinecraftKey
}

export interface MinecraftKey {
    reasons: {
        'multiplayer.disconnect.authservers_down': string
        'multiplayer.disconnect.banned': string
        'multiplayer.disconnect.duplicate_login': string
        'multiplayer.disconnect.flying': string
        'multiplayer.disconnect.idling': string
        'multiplayer.disconnect.illegal_characters': string
        'multiplayer.disconnect.invalid_entity_attacked': string
        'multiplayer.disconnect.invalid_player_movement': string
        'multiplayer.disconnect.invalid_vehicle_movement': string
        'multiplayer.disconnect.ip_banned': string
        'multiplayer.disconnect.kicked': string
        'multiplayer.disconnect.server_shutdown': string
        'multiplayer.disconnect.slow_login': string
        'multiplayer.disconnect.unverified_username': string
        'disconnect.timeout': string
    }
}
