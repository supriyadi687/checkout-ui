import {customAlphabet} from 'nanoid';
export function randomId(prefix) {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYabcdefghijklmnopqrstuvwxyz0123456789-";
    return prefix + "_" + customAlphabet(alphabet,21);
}
