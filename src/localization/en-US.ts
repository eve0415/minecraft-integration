import { Language, MinecraftKey } from '../typings';

export default class extends Language {
    public constructor() {
        super({
            default: true,
            code: 'en-US',
            strings,
        });
    }
}

const strings: MinecraftKey = {
    reasons: {
        'multiplayer.disconnect.authservers_down': 'Authentication servers are down. Please try again later, sorry!',
        'multiplayer.disconnect.banned': 'You are banned from this server.',
        'multiplayer.disconnect.duplicate_login': 'You logged in from another location',
        'multiplayer.disconnect.flying': 'Flying is not enabled on this server',
        'multiplayer.disconnect.idling': 'You have been idle for too long!',
        'multiplayer.disconnect.illegal_characters': 'Illegal characters in chat',
        'multiplayer.disconnect.invalid_entity_attacked': 'Attempting to attack an invalid entity',
        'multiplayer.disconnect.invalid_player_movement': 'Invalid move player packet received',
        'multiplayer.disconnect.invalid_vehicle_movement': 'Invalid move player packet received',
        'multiplayer.disconnect.ip_banned': 'You have been IP banned.',
        'multiplayer.disconnect.kicked': 'Kicked by an operator.',
        'multiplayer.disconnect.server_shutdown': 'Server closed',
        'multiplayer.disconnect.slow_login': 'Took too long to log in',
        'multiplayer.disconnect.unverified_username': 'Failed to verify username!',
        'disconnect.timeout': 'Timed out',
    },
};
