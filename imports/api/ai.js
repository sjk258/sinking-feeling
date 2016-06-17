import * as AI_Sue from './ai/sue.js';

const ai_players = {
    'sue': AI_Sue,
};

export const default_name = 'sue';

export function getNames() {
    return Object.keys(ai_players);
}

export function getPlayer(name) {
    if (!(name in ai_players)) {
        name = default_name;
    }
    return ai_players[name];
}