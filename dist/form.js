export function createAudioStartForm() {
    var _a;
    const form = document.createElement("div");
    form.classList.add("form");
    const subform = document.createElement("form");
    subform.classList.add("subform");
    form.appendChild(subform);
    const promptText = document.createElement("span");
    promptText.innerText = "Audio Initialized";
    const input = document.createElement("input");
    input.setAttribute("type", "submit");
    input.setAttribute("value", "OK");
    // input.classList.add(`${value}Value`);
    // input.id = `${value}Value`;
    subform.appendChild(promptText);
    subform.appendChild(input);
    (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.appendChild(form);
    return form;
}
export const formEventListener = (cb) => {
    const form = document.querySelector(".form");
    if (!form)
        return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Starting audio");
        cb();
        form.classList.toggle("inactive", true);
    });
};
