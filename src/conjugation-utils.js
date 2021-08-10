const U_VERB_I_CONVERSION_TABLE = {
    "う": "い",
    "く": "き",
    "ぐ": "ぎ",
    "す": "し",
    "ず": "じ",
    "つ": "ち",
    "づ": "ぢ",
    "ぬ": "に",
    "ふ": "ひ",
    "ぶ": "び",
    "ぷ": "ぴ",
    "む": "み",
    "る": "り"
}

const U_VERB_A_CONVERSION_TABLE = {
    "う": "わ",
    "く": "か",
    "ぐ": "が",
    "す": "さ",
    "ず": "ざ",
    "つ": "た",
    "づ": "だ",
    "ぬ": "な",
    "ふ": "は",
    "ぶ": "ば",
    "ぷ": "ぱ",
    "む": "ま",
    "る": "ら"
}

const U_VERB_TE_CONVERSION_TABLE = {
    "う": "って",
    "く": "いて",
    "ぐ": "いで",
    "す": "して",
    "つ": "って",
    "ぬ": "んで",
    "ぶ": "んで",
    "む": "んで",
    "る": "って"
}

const VERB_TE_OVERRIDES = {
    "いく": "いって"
}

const ADJ_LONG_PRES_NEG_OVERRIDES = {
    "いい": "よくないです",
    "かっこいい": "かっこよくないです",
    "あたまがいい": "あたまがよくないです"
}

const ADJ_SHORT_PRES_NEG_OVERRIDES = {
    "いい": "よくない",
    "かっこいい": "かっこよくない",
    "あたまがいい": "あたまがよくない"
}

const ADJ_PAST_POS_OVERRIDES = {
    "いい": "よかったです",
    "かっこいい": "かっこよかったです",
    "あたまがいい": "あたまがよかったです"
}

const ADJ_PAST_NEG_OVERRIDES = {
    "いい": "よくなかったです",
    "かっこいい": "かっこよくなかったです",
    "あたまがいい": "あたまがよくなかったです"
}

const ADJ_TE_OVERRIDES = {
    "いい": "よくて",
    "かっこいい": "かっこよくて",
    "あたまがいい": "あたまがよくて"
}

export function verbLongPresentPositive(word) {
    let result = word.hiragana;

    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ます");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_I_CONVERSION_TABLE[result[result.length - 1]] + "ます")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ます";
    }

    return result;
}

export function verbLongPresentNegative(word) {
    let result = word.hiragana;

    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ません");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_I_CONVERSION_TABLE[result[result.length - 1]] + "ません")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ません";
    }

    return result;
}

export function verbLongPastPositive(word) {
    let result = word.hiragana;

    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ました");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_I_CONVERSION_TABLE[result[result.length - 1]] + "ませんでした")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ました";
    }

    return result;
}

export function verbLongPastNegative(word) {
    let result = word.hiragana;
    
    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ませんでした");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_I_CONVERSION_TABLE[result[result.length - 1]] + "ませんでした")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ませんでした";
    }

    return result;
}

export function verbShortPresentPositive(word) {
    let result = word.hiragana;

    //nothing to do, equivalent to dictionary form!

    return result;
}

export function verbShortPresentNegative(word) {
    let result = word.hiragana;

    if (result === "ある") {
        result = "ない";
    } else if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ない");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_A_CONVERSION_TABLE[result[result.length - 1]] + "ない")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "しない");
        result = result.replace(/くる$/giu, "こない");
    }

    return result;
}

export function verbTe(word) {
    let result = word.hiragana;

    if (VERB_TE_OVERRIDES[result]) {
        result = VERB_TE_OVERRIDES[result];
    } else if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "て");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_TE_CONVERSION_TABLE[result[result.length - 1]])
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "して");
        result = result.replace(/くる$/giu, "きて");
    }

    return result;
}

export function adjLongPresentPositive(word) {
    let result = word.hiragana;

    if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "です");
    } else if (word.type === "i-adjective") {
        result = result + "です";
    }

    return result;
}

export function adjLongPresentNegative(word) {
    let result = word.hiragana;

    if (ADJ_LONG_PRES_NEG_OVERRIDES[result]) {
        result = ADJ_LONG_PRES_NEG_OVERRIDES[result];
    } else if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "じゃないです");
    } else if (word.type === "i-adjective") {
        result = result.replace(/い$/giu, "くないです");
    }

    return result;

}

export function adjLongPastPositive(word) {
    let result = word.hiragana;

    if (ADJ_PAST_POS_OVERRIDES[result]) {
        result = ADJ_PAST_POS_OVERRIDES[result];
    } else if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "だった");
    } else if (word.type === "i-adjective") {
        result = result.replace(/い$/giu, "かったです");
    }

    return result;
}

export function adjLongPastNegative(word) {
    let result = word.hiragana;

    if (ADJ_PAST_NEG_OVERRIDES[result]) {
        result = ADJ_PAST_NEG_OVERRIDES[result];
    } else if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "じゃなかったです");
    } else if (word.type === "i-adjective") {
        result = result.replace(/い$/giu, "くなかったです");
    }

    return result;
}

export function adjShortPresentPositive(word) {
    let result = word.hiragana;

    if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "");
    }

    return result;
}

export function adjShortPresentNegative(word) {
    let result = word.hiragana;

    if (ADJ_SHORT_PRES_NEG_OVERRIDES[result]) {
        result = ADJ_SHORT_PRES_NEG_OVERRIDES[result];
    } else if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "じゃない");
    } else if (word.type === "i-adjective") {
        result = result.replace(/い$/giu, "くない");
    }

    return result;

}

export function adjTe(word) {
    let result = word.hiragana;

    if (ADJ_TE_OVERRIDES[result]) {
        result = ADJ_TE_OVERRIDES[result];
    } else if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "で");
    } else if (word.type === "i-adjective") {
        result = result.replace(/い$/giu, "くて");
    }

    return result;
}