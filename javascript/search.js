/* =========================
   TOPICS EXPLORER (DESKTOP)
========================= */
const explorer = document.getElementById("topicsExplorer");
const topicsBtn = document.getElementById("topicsMoreBtn");

if (explorer && topicsBtn) {
  const topicsDropdown = explorer.querySelector(".search-topics-explorer-wrap");

  topicsBtn.addEventListener("click", () => {
    const expanded = topicsBtn.getAttribute("aria-expanded") === "true";

    topicsBtn.setAttribute("aria-expanded", String(!expanded));
    explorer.classList.toggle("search-topics-explorer--expanded");
    topicsDropdown.hidden = expanded;
  });
}

/* =========================
   FILTERS (MOBILE)
========================= */
const filtersWrapper = document.querySelector(".search-controls-wrapper");
const openFiltersBtn = document.getElementById("openFilters");
const closeFiltersBtn = document.getElementById("closeFilters");

openFiltersBtn?.addEventListener("click", () => {
  filtersWrapper?.classList.add("is-open");
});

closeFiltersBtn?.addEventListener("click", () => {
  filtersWrapper?.classList.remove("is-open");
});

/* =========================
   SEGMENTED CONTROL
========================= */
document.querySelectorAll(".segmented-control").forEach(control => {
  control.addEventListener("click", e => {
    if (!e.target.classList.contains("segment")) return;

    control
      .querySelectorAll(".segment")
      .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");
  });
});

/* =========================
   CUSTOM DROPDOWN (GRADE)
========================= */
document.querySelectorAll("[data-select]").forEach(select => {
  const trigger = select.querySelector(".custom-select__trigger");
  const value = select.querySelector(".custom-select__value");
  const options = select.querySelectorAll(".custom-select__option");

  trigger.addEventListener("click", e => {
    e.stopPropagation();

    // close other dropdowns
    document.querySelectorAll(".custom-select.open").forEach(el => {
      if (el !== select) el.classList.remove("open");
    });

    select.classList.toggle("open");
  });

  options.forEach(option => {
    option.addEventListener("click", () => {
      select
        .querySelector(".custom-select__option.selected")
        ?.classList.remove("selected");

      option.classList.add("selected");
      value.textContent = option.childNodes[0].textContent.trim();
      select.classList.remove("open");
    });
  });
});

/* =========================
   CLOSE DROPDOWNS ON CLICK OUTSIDE
========================= */
document.addEventListener("click", () => {
  document
    .querySelectorAll(".custom-select.open")
    .forEach(el => el.classList.remove("open"));
});


/* =========================
   CLEAR FILTERS (CHECKBOXES)
========================= */
document.querySelectorAll('.filter-group').forEach(group => {
  const clearBtn = group.querySelector('.clear-filter');
  if (!clearBtn) return;

  const inputs = group.querySelectorAll('input[type="checkbox"]');

  inputs.forEach(input => {
    input.addEventListener('change', () => {
      clearBtn.hidden = ![...inputs].some(i => i.checked);
    });
  });

  clearBtn.addEventListener('click', () => {
    inputs.forEach(i => (i.checked = false));
    clearBtn.hidden = true;
  });
});

/* =========================
   RANGE SLIDERS
========================= */
document.querySelectorAll('.filter-group[data-range]').forEach(group => {
  const slider = group.querySelector('.range-slider');
  const bubble = group.querySelector('.range-bubble');
  const label = group.querySelector('.range-label');
  const clearBtn = group.querySelector('.clear-filter');

  // INITIAL STATE
  bubble.style.display = 'none';
  clearBtn.hidden = true;
  label.textContent = 'Select a value';

  const update = () => {
    const val = Number(slider.value);
    const min = Number(slider.min);
    const max = Number(slider.max);

    // Show UI only after interaction
    bubble.style.display = 'block';
    clearBtn.hidden = false;

    const percent = ((val - min) / (max - min)) * 100;
    bubble.style.left = `${percent}%`;

    if (group.dataset.range === 'tuition') {
      bubble.textContent = `$${val.toLocaleString()}`;
      label.textContent = `$0 – $${val.toLocaleString()}`;
    } else {
      bubble.textContent = `${val}:1`;
      label.textContent = `${val}:1`;
    }
  };

  slider.addEventListener('input', update);

  clearBtn.addEventListener('click', () => {
    slider.value = slider.min;

    bubble.style.display = 'none';
    clearBtn.hidden = true;
    label.textContent = 'Select a value';
  });
});

/* =========================
   NICHE GRADES (RADIO)
========================= */
document.querySelectorAll('[data-grade]').forEach(block => {
  const buttons = block.querySelectorAll('.grade-pills button');
  const clearBtn = block.querySelector('.clear-filter');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      clearBtn.hidden = false;
    });
  });

  clearBtn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    clearBtn.hidden = true;
  });
});

