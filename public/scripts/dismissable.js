
class Dismissable {
    /**
     * @type {HTMLDivElement}
     */
    #element;

    /**
     * @type {number}
     */
    #timeout;

    constructor(element, timeout = 500) {
        this.#element = element;
        this.#timeout = timeout;
        this.#init(element);
    }
    
    /**
     * @param {HTMLDivElement} element 
     */
    #init(element) {
        const header = element.querySelector("header");
        element.style.position = "relative";

        const dismiss = document.createElement("button");
        dismiss.innerText = "Dismiss";
        dismiss.addEventListener("click", this.dismiss.bind(this));
        dismiss.classList.add("top-right");

        header.appendChild(dismiss);
    }

    dismiss() {
        this.#element.classList.add("hide");
        setTimeout(() => this.#element.remove(), this.#timeout);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const dismissables = [ ...document.querySelectorAll(".dismissable") ].map(el => new Dismissable(el));
    console.log(`${dismissables.length} dismissables found on the page.`);
});
