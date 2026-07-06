(function () {
  const root = document.documentElement;
  const storageKey = "portfolio-theme";
  const savedTheme = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  root.dataset.theme = initialTheme;

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function copyToClipboard(text, successMessage, fallbackMessage) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(text).then(
        () => showToast(successMessage),
        () => showToast(fallbackMessage || text)
      );
      return;
    }
    showToast(fallbackMessage || text);
  }

  const profileImage = document.querySelector(".profile-image img");
  if (profileImage) {
    profileImage.addEventListener("error", () => {
      profileImage.closest(".profile-image")?.classList.add("is-missing");
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = nextTheme;
      localStorage.setItem(storageKey, nextTheme);
      showToast(nextTheme === "dark" ? "Dark theme enabled" : "Light theme enabled");
    });
  }

  const newsList = document.getElementById("news-list");
  const showNews = document.getElementById("show-news");
  if (newsList && showNews) {
    showNews.addEventListener("click", () => {
      const expanded = newsList.classList.toggle("is-expanded");
      showNews.setAttribute("aria-expanded", String(expanded));
      showNews.textContent = expanded ? "Show fewer updates" : "Show more updates";
    });
  }

  document.querySelectorAll(".bib-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const bibtex = button.closest(".pub-content")?.querySelector(".bibtex");
      if (!bibtex) return;
      const visible = bibtex.classList.toggle("is-visible");
      button.setAttribute("aria-expanded", String(visible));
      if (visible) {
        const text = bibtex.textContent.trim();
        copyToClipboard(text, "BibTeX copied", "BibTeX opened");
      }
    });
  });

  document.querySelectorAll(".copy-email").forEach((button) => {
    button.addEventListener("click", () => {
      const email = button.getAttribute("data-copy") || "your.email@example.com";
      copyToClipboard(email, "Email copied", email);
    });
  });

  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
