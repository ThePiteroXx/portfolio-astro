document.addEventListener("astro:page-load", () => {
  const formEmail = document.querySelector(
    "#contact-email",
  ) as HTMLInputElement;
  const formName = document.querySelector("#contact-name") as HTMLInputElement;
  const formMessage = document.querySelector(
    "#contact-msg",
  ) as HTMLInputElement;
  const communique = document.querySelector(
    "#contact-communique",
  ) as HTMLDivElement;
  const formButton = document.querySelector(
    "#contact-btn",
  ) as HTMLButtonElement;

  const regexEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const fields = [
    { name: "First name", element: formName },
    { name: "Email", element: formEmail },
    { name: "Message", element: formMessage },
  ];

  formButton.addEventListener("click", onSubmit);

  async function onSubmit(event: Event) {
    event.preventDefault();

    const { message: validateMessage, status } = validateForm();

    if (status === "error") {
      communique.classList.add("error");
      communique.textContent = validateMessage;
      return;
    }

    const [user, email, message] = [
      formName.value,
      formEmail.value,
      formMessage.value,
    ];
    clearForm();
    setLoadingButton(true);

    if (status === "success") {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          email,
          message,
        }),
      });
      const data: { status: "success" | "error" } = await response.json();

      if (data.status === "success") {
        communique.classList.remove("error");
        communique.textContent = "Send message has been successful";
      } else {
        communique.classList.add("error");
        communique.textContent =
          "Something has gone wrong! Please try again later.";
      }
    }
    setLoadingButton(false);
  }

  function clearForm() {
    formName.value = "";
    formEmail.value = "";
    formMessage.value = "";
    communique.textContent = "";
  }

  function clearInvalidFields() {
    formName.setCustomValidity("");
    formEmail.setCustomValidity("");
    formMessage.setCustomValidity("");
    formEmail.setCustomValidity("");
  }

  function validateForm(): { message: string; status: "error" | "success" } {
    clearInvalidFields();

    for (const field of fields) {
      const { name, element } = field;
      const value = element.value.trim();

      if (!value) {
        element.setCustomValidity("Field is required");
        return { message: `${name} field is required`, status: "error" };
      }
    }

    if (!regexEmail.test(formEmail.value.toLowerCase())) {
      formEmail.setCustomValidity("Invalid email");
      return {
        message: "Please correct your email address.",
        status: "error",
      };
    }

    return { message: "", status: "success" };
  }

  function setLoadingButton(isLoading: boolean) {
    // if parameter true -> disable form button
    if (isLoading) {
      formButton.disabled = true;
      formButton.textContent = "Loading...";
      formButton.classList.add("contact__btn--disabled");
    }
    // if parameter false -> enable form button
    else {
      formButton.disabled = false;
      formButton.textContent = "Send message";
      formButton.classList.remove("contact__btn--disabled");
    }
  }
});
