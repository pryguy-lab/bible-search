function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function splitTableRow(row) {
  const trimmed = row.trim();
  const normalized = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return normalized.split("|").map((cell) => cell.trim());
}

function renderInlineMarkdown(text) {
  let output = escapeHtml(text || "");

  // Linked images (badge markdown): [![alt](src)](href)
  output = output.replace(
    /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
    (_, alt, src, href) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer"><img src="${src}" alt="${alt}" /></a>`,
  );

  // Standalone images: ![alt](src)
  output = output.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => `<img src="${src}" alt="${alt}" />`,
  );

  // Links: [text](href)
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, href) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );

  // Inline code
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold then italics
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return output;
}

function renderSimpleMarkdown(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const html = [];
  let inCode = false;
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";

    if (line.startsWith("```")) {
      closeList();
      if (!inCode) {
        html.push("<pre><code>");
      } else {
        html.push("</code></pre>");
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      html.push(`${escapeHtml(rawLine)}\n`);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (/^\s*-{3,}\s*$/.test(line)) {
      closeList();
      html.push("<hr />");
      continue;
    }

    // GitHub-style table header + separator
    if (
      line.includes("|") &&
      /^\|?\s*[:\-]+(?:\s*\|\s*[:\-]+)+\s*\|?$/.test(nextLine)
    ) {
      closeList();
      const headerCells = splitTableRow(line);
      html.push("<table><thead><tr>");
      for (const cell of headerCells) {
        html.push(`<th>${renderInlineMarkdown(cell)}</th>`);
      }
      html.push("</tr></thead><tbody>");
      i += 2;

      while (i < lines.length && lines[i].includes("|")) {
        const rowCells = splitTableRow(lines[i]);
        html.push("<tr>");
        for (const cell of rowCells) {
          html.push(`<td>${renderInlineMarkdown(cell)}</td>`);
        }
        html.push("</tr>");
        i += 1;
      }
      i -= 1;
      html.push("</tbody></table>");
      continue;
    }

    if (line.startsWith("> ")) {
      closeList();
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i += 1;
      }
      i -= 1;
      html.push(
        `<blockquote><p>${renderInlineMarkdown(quoteLines.join("<br />"))}</p></blockquote>`,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${renderInlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${renderInlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${renderInlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${renderInlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }

  closeList();
  if (inCode) {
    html.push("</code></pre>");
  }

  return html.join("\n");
}

function removeQuickNavigationSection(container) {
  const headings = container.querySelectorAll("h1, h2, h3");
  for (const heading of headings) {
    if (heading.textContent.trim().toLowerCase() !== "quick navigation") {
      continue;
    }

    let cursor = heading.nextElementSibling;
    heading.remove();

    while (cursor) {
      const next = cursor.nextElementSibling;
      if (cursor.matches("h1, h2, h3")) {
        break;
      }
      cursor.remove();
      cursor = next;
    }
    break;
  }
}

function moveAiStatementBelowTitle(container) {
  const targetText = "This web app was created entirely by AI.";
  const title = container.querySelector("h1");
  if (!title) {
    return;
  }

  let statement = null;
  const paragraphs = container.querySelectorAll("p");
  for (const paragraph of paragraphs) {
    if (paragraph.textContent.trim() === targetText) {
      statement = paragraph;
      break;
    }
  }

  if (!statement) {
    statement = document.createElement("p");
    statement.textContent = targetText;
  }

  statement.classList.add("lead-ai-note");
  title.insertAdjacentElement("afterend", statement);
}

async function loadReadme() {
  const container = document.getElementById("readmeContainer");
  const status = document.getElementById("status");

  try {
    const response = await fetch("/README.md", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`README request failed with status ${response.status}`);
    }

    const markdown = await response.text();
    container.innerHTML = renderSimpleMarkdown(markdown);
    removeQuickNavigationSection(container);
    moveAiStatementBelowTitle(container);
    status.textContent = "README loaded";
  } catch (error) {
    container.innerHTML =
      '<div class="error">Could not load README. Please try again.</div>';
    status.textContent = "README unavailable";
    console.error(error);
  }
}

loadReadme();
