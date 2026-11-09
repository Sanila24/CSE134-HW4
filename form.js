"use strict";

const form_errors = [];

(() => {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const fields = ["name", "email", "comments"].map(
        id => document.getElementById(id)
    );

    const labels = {
        name: "Name",
        email: "Email",
        comments: "Comments"
    };

    const comments = document.getElementById("comments");
    const errorArea = document.getElementById("error-area");
    const infoArea = document.getElementById("info-area");
    const counter = document.getElementById("comments-count");
    const historyField = document.getElementById("form-errors");

    const edited = new Set();
    const revealed = new Set();
    let attempt = 0;

    function validate(field) {
        // Clear stale custom errors before inspecting native constraints.
        field.setCustomValidity("");

        const validity = field.validity;
        let message = "";

        if (validity.valueMissing) {
            message = `Enter your ${labels[field.id].toLowerCase()}.`;
        } else if (validity.typeMismatch) {
            message = "Enter an email address such as student@example.com.";
        } else if (validity.tooShort) {
            message = `Enter at least ${field.minLength} characters.`;
        } else if (validity.tooLong) {
            message = `Use no more than ${field.maxLength} characters.`;
        } else if (!validity.valid) {
            message = "Check this field and follow its instructions.";
        }

        field.setCustomValidity(message);
        return message;
    }

    function showError(field, message) {
        const item = document.getElementById(`${field.id}-error`);
        const text = message ? `${labels[field.id]}: ${message}` : "";

        if (item.textContent !== text) {
            item.textContent = text;
        }

        item.hidden = !message;

        if (message) {
            field.setAttribute("aria-invalid", "true");
        } else {
            field.removeAttribute("aria-invalid");
        }
    }

    function updateCounter() {
        const remaining = comments.maxLength - comments.value.length;
        const threshold = Math.min(
            100,
            Math.floor(comments.maxLength * 0.1)
        );

        let message = `${remaining} characters remaining.`;

        if (remaining === 0) {
            message =
                "0 characters remaining. You have reached the limit. " +
                "Your message can still be submitted.";
        } else if (remaining <= threshold) {
            message = `Warning: only ${remaining} characters remaining.`;
        }

        counter.textContent = message;
        infoArea.classList.toggle("is-warning", remaining <= threshold);
        infoArea.classList.toggle("is-limit", remaining === 0);
    }

    for (const field of fields) {
        field.addEventListener("input", () => {
            edited.add(field.id);

            if (revealed.has(field.id)) {
                showError(field, validate(field));
            } else {
                field.setCustomValidity("");
            }

            if (field === comments) {
                updateCounter();
            }
        });

        field.addEventListener("blur", () => {
            if (edited.has(field.id)) {
                revealed.add(field.id);
                showError(field, validate(field));
            }
        });
    }

    form.addEventListener("submit", event => {
        attempt += 1;
        let firstInvalid = null;

        for (const field of fields) {
            revealed.add(field.id);

            const message = validate(field);
            showError(field, message);

            if (message) {
                firstInvalid ??= field;

                form_errors.push({
                    field: field.name,
                    error: message,
                    attempt
                });
            }
        }

        if (firstInvalid) {
            event.preventDefault();

            firstInvalid.reportValidity();
            return;
        }

        historyField.value = JSON.stringify(form_errors);

    });

  
    updateCounter();
    errorArea.hidden = false;
    infoArea.hidden = false;
    form.noValidate = true;
})();