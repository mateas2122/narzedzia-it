const uuidOutput = document.querySelector("#uuid-output");
const generateUUIDButton = document.querySelector("#generate-uuid");
const copyUUIDButton = document.querySelector("#copy-uuid");

function generateUUID() {
    uuidOutput.value = crypto.randomUUID();
}

generateUUIDButton.addEventListener("click", generateUUID);

copyUUIDButton.addEventListener("click", async () => {
    if (!uuidOutput.value) {
        return;
    }

    await navigator.clipboard.writeText(uuidOutput.value);

    const originalText = copyUUIDButton.innerHTML;

    copyUUIDButton.innerHTML = `
        <i>check</i>
        <span>Skopiowano</span>
    `;

    setTimeout(() => {
        copyUUIDButton.innerHTML = originalText;
    }, 1500);
});

generateUUID();