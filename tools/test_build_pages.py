import json
import shutil
import tempfile
import unittest
from pathlib import Path

from build_pages import CSP, PUBLIC_FILES, SOURCE, PagePolicy, build, public_projects


def data(entries):
    return "window.PROJECTS = " + json.dumps(entries) + ";"


def entry(status="published"):
    return dict(slug="example", title="Example", category="Notes", description="Public",
                status=status, visual="steps", date="2026-09-19", content=[])


class PublicationChecks(unittest.TestCase):
    def test_drafts_and_extra_fields_do_not_ship(self):
        published = entry()
        published["private_notes"] = "NOT_FOR_PUBLICATION"
        draft = entry("draft")
        draft["content"] = [{"type": "paragraph", "text": "CONFIDENTIAL_DRAFT"}]
        result = json.dumps(public_projects(data([published, draft])))
        self.assertNotIn("CONFIDENTIAL_DRAFT", result)
        self.assertNotIn("private_notes", result)
        self.assertNotIn("NOT_FOR_PUBLICATION", result)

    def test_upcoming_article_body_does_not_ship(self):
        post = entry("upcoming")
        post["content"] = [{"type": "paragraph", "text": "UNFINISHED_BODY"}]
        post["link"] = "https://example.com/unannounced"
        result = public_projects(data([post]))[0]
        self.assertEqual(result["content"], [])
        self.assertNotIn("link", result)

    def test_executable_javascript_is_not_accepted_as_data(self):
        for payload in ("window.PROJECTS = []; alert(1);", "window.PROJECTS = [alert(1)];"):
            with self.assertRaises(ValueError):
                public_projects(payload)

    def test_unsafe_links_fail_the_build(self):
        for url in ("javascript:alert(1)", "data:text/html,hello", "http://example.com",
                    "https://user:password@example.com", "//example.com", "https://"):
            with self.subTest(url=url):
                post = entry()
                post["content"] = [{"type": "paragraph", "text": "Text",
                                    "source": {"label": "Source", "url": url}}]
                with self.assertRaises(ValueError):
                    public_projects(data([post]))

    def test_browser_policy_rejects_active_content(self):
        for markup in ('<script>alert(1)</script>', '<img src="x" onerror="alert(1)">',
                       '<p style="color:red">text</p>', '<iframe src="https://example.com"></iframe>',
                       '<a href="javascript:alert(1)">link</a>', '<a href="../README.md">link</a>'):
            with self.subTest(markup=markup), self.assertRaises(ValueError):
                PagePolicy().feed(markup)

    def test_whole_site_artifact_contains_only_approved_files(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / "public"
            build(SOURCE, output)
            files = {p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()}
            self.assertEqual(files, set(PUBLIC_FILES) | {"projects.js", ".nojekyll"})
            for name in (n for n in PUBLIC_FILES if n.endswith(".html")):
                self.assertIn(CSP, (output / name).read_text())
            self.assertEqual(public_projects((output / "projects.js").read_text()),
                             public_projects((SOURCE / "projects.js").read_text()))

    def test_symlinked_assets_and_existing_output_are_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp).resolve()
            source = root / "source"
            shutil.copytree(SOURCE, source)
            asset = source / "assets/favicon.svg"
            asset.unlink()
            asset.symlink_to(SOURCE / "assets/favicon.svg")
            with self.assertRaises(ValueError):
                build(source, root / "public")
            output = root / "existing"
            output.mkdir()
            sentinel = output / "keep.txt"
            sentinel.write_text("Keep this file")
            with self.assertRaises(FileExistsError):
                build(SOURCE, output)
            self.assertEqual(sentinel.read_text(), "Keep this file")


if __name__ == "__main__":
    unittest.main()
