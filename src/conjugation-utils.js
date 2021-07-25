const U_VERB_CONVERSION_TABLE = {
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

const ADJ_PRES_NEG_OVERRIDES = {
    "いい": "よくないです"
}

const ADJ_PAST_POS_OVERRIDES = {
    "いい": "よかったです"
}

const ADJ_PAST_NEG_OVERRIDES = {
    "いい": "よくなかったです",
}

const ADJ_TE_OVERRIDES = {
    "いい": "よくて"
}

function verbPresentPositive(word) {
    let result = word.hiragana;

    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ます");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_CONVERSION_TABLE[result[result.length - 1]] + "ます")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ます";
    }

    return result;
}

function verbPresentNegative(word) {
    let result = word.hiragana;

    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ません");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_CONVERSION_TABLE[result[result.length - 1]] + "ません")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ません";
    }

    return result;
}

function verbPastPositive(word) {
    let result = word.hiragana;

    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ました");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_CONVERSION_TABLE[result[result.length - 1]] + "ませんでした")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ました";
    }

    return result;
}

function verbPastNegative(word) {
    let result = word.hiragana;
    
    if (word.type === "ru-verb") {
        result = result.replace(/る$/giu, "ませんでした");
    } else if (word.type === "u-verb") {
        result = result.replace(/.$/giu, U_VERB_CONVERSION_TABLE[result[result.length - 1]] + "ませんでした")
    } else if (word.type === "irregular-verb") {
        result = result.replace(/する$/giu, "し");
        result = result.replace(/くる$/giu, "き");
        result += "ませんでした";
    }

    return result;
}

function verbTe(word) {
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

function adjPresentPositive(word) {
    let result = word.hiragana;

    if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "です");
    } else if (word.type === "i-adjective") {
        result = result + "です";
    }

    return result;
}

function adjPresentNegative(word) {
    let result = word.hiragana;

    if (ADJ_PRES_NEG_OVERRIDES[result]) {
        result = ADJ_PRES_NEG_OVERRIDES[result];
    } else if (word.type === "na-adjective") {
        result = result.replace(/\s\(な\)/giu, "じゃないです");
    } else if (word.type === "i-adjective") {
        result = result.replace(/い$/giu, "くないです");
    }

    return result;

}

function adjPastPositive(word) {
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

function adjPastNegative(word) {
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

function adjTe(word) {
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

module.exports = { 
    verbPresentPositive, 
    verbPresentNegative, 
    verbPastPositive, 
    verbPastNegative,
    verbTe,
    adjPresentPositive,
    adjPresentNegative,
    adjPastPositive,
    adjPastNegative,
    adjTe
}