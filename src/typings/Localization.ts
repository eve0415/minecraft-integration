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

    // Minecraft Java Edition version 1.16.4
    advancements: {
        'MINECRAFT_STORY_ROOT': string
        'MINECRAFT_STORY_MINE_STONE': string
        'MINECRAFT_STORY_UPGRADE_TOOLS': string
        'MINECRAFT_STORY_SMELT_IRON': string
        'MINECRAFT_STORY_OBTAIN_ARMOR': string
        'MINECRAFT_STORY_LAVA_BUCKET': string
        'MINECRAFT_STORY_IRON_TOOLS': string
        'MINECRAFT_STORY_DEFLECT_ARROW': string
        'MINECRAFT_STORY_FORM_OBSIDIAN': string
        'MINECRAFT_STORY_MINE_DIAMOND': string
        'MINECRAFT_STORY_ENTER_THE_NETHER': string
        'MINECRAFT_STORY_SHINY_GEAR': string
        'MINECRAFT_STORY_ENCHANT_ITEM': string
        'MINECRAFT_STORY_CURE_ZOMBIE_VILLAGER': string
        'MINECRAFT_STORY_FOLLOW_ENDER_EYE': string
        'MINECRAFT_STORY_ENTER_THE_END': string
        'MINECRAFT_NETHER_ROOT': string
        'MINECRAFT_NETHER_RETURN_TO_SENDER': string
        'MINECRAFT_NETHER_FIND_BASTON': string
        'MINECRAFT_NETHER_OBTAIN_ANCIENT_DEBRIS': string
        'MINECRAFT_NETHER_FAST_TRAVEL': string
        'MINECRAFT_NETHER_FIND_FORTRESS': string
        'MINECRAFT_NETHER_OBTAIN_CRYING_OBSIDIAN': string
        'MINECRAFT_NETHER_DISTRACT_PIGLIN': string
        'MINECRAFT_NETHER_RIDE_STRIDER': string
        'MINECRAFT_NETHER_UNEASY_ALLIANCE': string
        'MINECRAFT_NETHER_LOOT_BASTION': string
        'MINECRAFT_NETHER_USE_LOADSTONE': string
        'MINECRAFT_NETHER_NETHERITE_ARMOR': string
        'MINECRAFT_NETHER_GET_WITHER_SKULL': string
        'MINECRAFT_NETHER_OBTAIN_BLAZE_ROD': string
        'MINECRAFT_NETHER_CHARGE_RESPAWN_ANCHOR': string
        'MINECRAFT_NETHER_EXPLORE_NETHER': string
        'MINECRAFT_NETHER_SUMMON_WITHER': string
        'MINECRAFT_NETHER_BREW_POTION': string
        'MINECRAFT_NETHER_CREATE_BEACON': string
        'MINECRAFT_NETHER_ALL_POTIONS': string
        'MINECRAFT_NETHER_CREATE_FULL_BEACON': string
        'MINECRAFT_NETHER_ALL_EFFECTS': string
        'MINECRAFT_END_ROOT': string
        'MINECRAFT_END_KILL_DRAGON': string
        'MINECRAFT_END_DRAGON_EGG': string
        'MINECRAFT_END_ENTER_END_GATEWAY': string
        'MINECRAFT_END_RESPAWN_DRAGON': string
        'MINECRAFT_END_DRAGON_BREATH': string
        'MINECRAFT_END_FIND_END_CITY': string
        'MINECRAFT_END_ELYTRA': string
        'MINECRAFT_END_LEVITATE': string
        'MINECRAFT_ADVENTURE_ROOT': string
        'MINECRAFT_ADVENTURE_VOLUNTARY_EXILE': string
        'MINECRAFT_ADVENTURE_KILL_A_MOB': string
        'MINECRAFT_ADVENTURE_TRADE': string
        'MINECRAFT_ADVENTURE_HONEY_BLOCK_SLIDE': string
        'MINECRAFT_ADVENTURE_OL_BETSY': string
        'MINECRAFT_ADVENTURE_SLEEP_IN_BED': string
        'MINECRAFT_ADVENTURE_HERO_OF_THE_VILLAGE': string
        'MINECRAFT_ADVENTURE_THROW_TRIDENT': string
        'MINECRAFT_ADVENTURE_SHOOT_ARROW': string
        'MINECRAFT_ADVENTURE_KILL_ALL_MOBS': string
        'MINECRAFT_ADVENTURE_TOTEM_OF_UNDYING': string
        'MINECRAFT_ADVENTURE_SUMMON_IRON_GOLEM': string
        'MINECRAFT_ADVENTURE_TWO_BIRDS_ONE_ARROW': string
        'MINECRAFT_ADVENTURE_WHOS_THE_PILLAGER_NOW': string
        'MINECRAFT_ADVENTURE_ARBALISTIC': string
        'MINECRAFT_ADVENTURE_ADVENTURING_TIME': string
        'MINECRAFT_ADVENTURE_VERY_VERY_FRIGHTENING': string
        'MINECRAFT_ADVENTURE_SNIPER_DUEL': string
        'MINECRAFT_ADVENTURE_BULLSEYE': string
        'MINECRAFT_HUSBANDRY_ROOT': string
        'MINECRAFT_HUSBANDRY_SAFELY_HARVEST_HONEY': string
        'MINECRAFT_HUSBANDRY_BREED_AN_ANIMAL': string
        'MINECRAFT_HUSBANDRY_TAME_AN_ANIMAL': string
        'MINECRAFT_HUSBANDRY_FISHY_BUSINESS': string
        'MINECRAFT_HUSBANDRY_SILK_TOUCH_NEST': string
        'MINECRAFT_HUSBANDRY_PLANT_SEED': string
        'MINECRAFT_HUSBANDRY_BRED_ALL_ANIMALS': string
        'MINECRAFT_HUSBANDRY_COMPLETE_CATALOGUE': string
        'MINECRAFT_HUSBANDRY_TACTICAL_FISHING': string
        'MINECRAFT_HUSBANDRY_BALANCED_DIET': string
        'MINECRAFT_HUSBANDRY_BREAK_DIAMOND_HOE': string
    }
}
