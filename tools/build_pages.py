"""Build a minimal Pages artifact without executing journal source code."""
import argparse
import json
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT 
CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; object-src 'none'"
PUBLIC_FILES = (
    "index.html", "journal.html", "project.html", "editorial-policy.html",
    "styles.css", "home.css", "script.js",
    "assets/favicon.svg", "assets/UsmanKhan_CV.pdf", "assets/usman-khan.jpeg",
    "assets/blueoptima-podcast.jpg", "assets/blueoptima-webinar.jpg",
    "assets/blueoptima-linkedin.jpg",
)


def secure_url(value):
    url = urlsplit(value)
    return (url.scheme == "https" and bool(url.hostname)
            and not url.username and not url.password
            and not any(c.isspace() for c in value) and "\\" not in value)


def public_projects(text):
    match = re.fullmatch(
        r"\s*(?:/\*.*?\*/\s*)?window\.PROJECTS\s*=\s*(\[.*\])\s*;\s*",
        text, re.DOTALL,
    )
    if not match:
        raise ValueError("projects.js must contain only the window.PROJECTS JSON assignment")
    projects = json.loads(match[1])
    public, slugs = [], set()
    for entry in projects:
        if entry.get("status") == "draft":
            continue
        if entry.get("status") not in ("published", "upcoming"):
            raise ValueError("Unknown journal status")
        slug = entry.get("slug", "")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or slug in slugs:
            raise ValueError("Invalid or duplicate journal slug")
        slugs.add(slug)
        # Only fields consumed by the website are eligible for publication.
        post = {key: entry[key] for key in (
            "slug", "title", "category", "description", "status", "visual", "date"
        )}
        if not all(isinstance(value, str) for value in post.values()):
            raise ValueError("Journal metadata must be text")
        post["content"] = []
        if post["status"] == "published":
            for block in entry.get("content", []):
                kind = block.get("type")
                if kind == "list":
                    items = block["items"]
                    if not isinstance(items, list) or not all(isinstance(x, str) for x in items):
                        raise ValueError("List entries must be text")
                    clean = {"type": kind, "items": items}
                elif kind in ("paragraph", "heading", "quote"):
                    if not isinstance(block.get("text"), str):
                        raise ValueError("Article content must be text")
                    clean = {"type": kind, "text": block["text"]}
                    if "source" in block:
                        source = block["source"]
                        if not secure_url(source["url"]) or not isinstance(source["label"], str):
                            raise ValueError("Article sources must use HTTPS without credentials")
                        clean["source"] = {"label": source["label"], "url": source["url"]}
                else:
                    raise ValueError("Unsupported article content type")
                post["content"].append(clean)
            if entry.get("link"):
                if not secure_url(entry["link"]):
                    raise ValueError("Project links must use HTTPS without credentials")
                post["link"] = entry["link"]
        public.append(post)
    return public


class PagePolicy(HTMLParser):
    def __init__(self):
        super().__init__()
        self.csp = False
        self.referrer = False
        self.in_script = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if any(key.startswith("on") or key == "style" for key in attrs):
            raise ValueError("Inline handlers and styles are not allowed")
        if tag in ("base", "iframe", "object", "embed", "form", "style"):
            raise ValueError(f"Unexpected active HTML element: {tag}")
        if tag == "meta":
            if attrs.get("http-equiv", "").lower() == "content-security-policy":
                if self.csp or attrs.get("content") != CSP:
                    raise ValueError("Unexpected or duplicate CSP")
                self.csp = True
            if attrs.get("name") == "referrer":
                self.referrer = attrs.get("content") == "no-referrer"
        if tag == "script":
            if not self.csp or attrs.get("src") not in ("script.js", "projects.js"):
                raise ValueError("Scripts require the policy and an approved local source")
            self.in_script = True
        if attrs.get("target") == "_blank":
            if not {"noopener", "noreferrer"} <= set(attrs.get("rel", "").split()):
                raise ValueError("New-tab links need opener and referrer protection")
        for attr in ("src", "href"):
            value = attrs.get(attr)
            if value is None:
                continue
            url = urlsplit(value)
            if url.scheme:
                if attr != "href" or not (secure_url(value) or url.scheme == "mailto"):
                    raise ValueError("Unexpected external resource or insecure link")
            elif url.netloc:
                raise ValueError("Protocol-relative URLs are not allowed")
            elif url.path and unquote(url.path) not in (*PUBLIC_FILES, "projects.js"):
                raise ValueError(f"Link points outside the public artifact: {value}")

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_script = False

    def handle_data(self, data):
        if self.in_script and data.strip():
            raise ValueError("Inline script content is not allowed")


def build(source, output):
    if source.is_symlink():
        raise ValueError("The source directory cannot be a symlink")
    source = source.resolve(strict=True)
    # Reject links even when they point back inside the source directory.
    for name in (*PUBLIC_FILES, "projects.js"):
        path = source / name
        if not path.is_file() or any(p.is_symlink() for p in (path, *path.parents)):
            raise ValueError(f"Missing file or symlink in public source: {name}")
        if path.suffix == ".html":
            audit = PagePolicy()
            audit.feed(path.read_text())
            if not audit.csp or not audit.referrer:
                raise ValueError(f"Missing browser policy: {name}")
    entries = public_projects((source / "projects.js").read_text())
    # Refuse to overwrite a directory that may contain unrelated user files.
    output.mkdir(parents=True, exist_ok=False)
    for name in PUBLIC_FILES:
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source / name, target)
    (output / "projects.js").write_text(
        "window.PROJECTS = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n"
    )
    (output / ".nojekyll").touch()
    print(f"Built {len(PUBLIC_FILES) + 2} public files in {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "_site")
    args = parser.parse_args()
    build(SOURCE, args.output.absolute())
