const passwordOutput = document.querySelector("#password-output");
const passwordLength = document.querySelector("#password-length");
const passwordStrength = document.querySelector("#password-strength");

const lowercase = document.querySelector("#lowercase");
const uppercase = document.querySelector("#uppercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");

const generatePasswordButton = document.querySelector("#generate-password");
const copyPasswordButton = document.querySelector("#copy-password");

const characterSets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.?/<>"
};

function randomNumber(max) {
    const array = new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0] % max;
}

function getSelectedCharacters() {
    let characters = "";

    if (lowercase.checked) {
        characters += characterSets.lowercase;
    }

    if (uppercase.checked) {
        characters += characterSets.uppercase;
    }

    if (numbers.checked) {
        characters += characterSets.numbers;
    }

    if (symbols.checked) {
        characters += characterSets.symbols;
    }

    return characters;
}

function generatePassword() {
    let length = Number(passwordLength.value);
    const characters = getSelectedCharacters();

    if (!passwordLength.value) {
        passwordOutput.value = "";
        passwordStrength.value = "";
        return;
    }

    if (!characters) {
        passwordOutput.value = "";
        passwordStrength.value = "Wybierz zestaw znaków";
        return;
    }

    if (length < 8) {
        passwordOutput.value = "";
        passwordStrength.value = "";
        return;
    }

    if (length > 64) {
        length = 64;
        passwordLength.value = 64;
    }

    const passwordCharacters = [];

    if (lowercase.checked) {
        passwordCharacters.push(
            characterSets.lowercase[
                randomNumber(characterSets.lowercase.length)
            ]
        );
    }

    if (uppercase.checked) {
        passwordCharacters.push(
            characterSets.uppercase[
                randomNumber(characterSets.uppercase.length)
            ]
        );
    }

    if (numbers.checked) {
        passwordCharacters.push(
            characterSets.numbers[
                randomNumber(characterSets.numbers.length)
            ]
        );
    }

    if (symbols.checked) {
        passwordCharacters.push(
            characterSets.symbols[
                randomNumber(characterSets.symbols.length)
            ]
        );
    }

    while (passwordCharacters.length < length) {
        passwordCharacters.push(
            characters[randomNumber(characters.length)]
        );
    }

    for (let i = passwordCharacters.length - 1; i > 0; i--) {
        const j = randomNumber(i + 1);

        [
            passwordCharacters[i],
            passwordCharacters[j]
        ] = [
            passwordCharacters[j],
            passwordCharacters[i]
        ];
    }

    passwordOutput.value = passwordCharacters.join("");

    updatePasswordStrength(length, characters.length);
}

function updatePasswordStrength(length, characterCount) {
    const entropy = length * Math.log2(characterCount);

    if (entropy < 50) {
        passwordStrength.value = "Słabe";
    } else if (entropy < 70) {
        passwordStrength.value = "Średnie";
    } else if (entropy < 100) {
        passwordStrength.value = "Silne";
    } else {
        passwordStrength.value = "Bardzo silne";
    }
}

generatePasswordButton.addEventListener("click", generatePassword);

passwordLength.addEventListener("input", () => {
    if (!passwordLength.value) {
        passwordOutput.value = "";
        passwordStrength.value = "";
        return;
    }

    generatePassword();
});

passwordLength.addEventListener("blur", () => {
    let length = Number(passwordLength.value);

    if (!length || length < 8) {
        length = 8;
    }

    if (length > 64) {
        length = 64;
    }

    passwordLength.value = length;

    generatePassword();
});

[
    lowercase,
    uppercase,
    numbers,
    symbols
].forEach((option) => {
    option.addEventListener("change", generatePassword);
});

copyPasswordButton.addEventListener("click", async () => {
    if (!passwordOutput.value) {
        return;
    }

    await navigator.clipboard.writeText(passwordOutput.value);

    const originalText = copyPasswordButton.innerHTML;

    copyPasswordButton.innerHTML = `
        <i>check</i>
        <span>Skopiowano</span>
    `;

    setTimeout(() => {
        copyPasswordButton.innerHTML = originalText;
    }, 1500);
});

generatePassword();