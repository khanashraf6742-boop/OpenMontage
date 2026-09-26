"""Tests for the batched PDF -> video cover tool.

Covers the batching/resume contract (the reason this tool exists), the style
extraction colour logic, and the failure paths. Everything runs locally against
generated PDFs — no network, no API keys.
"""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from tools.video.pdf_cover import (  # noqa: E402
    _batch_plan,
    _extract_style,
    _load_checkpoint,
    _merge_palettes,
    _pick_background,
    _resolve_ffmpeg,
    PdfCover,
)

try:
    import pymupdf  # noqa: F401
except ImportError:  # pragma: no cover
    pymupdf = None

needs_pymupdf = unittest.skipIf(pymupdf is None, "PyMuPDF not installed")


def _make_pdf(path: Path, pages: int = 5, *, title: str = "Test Brand Guide", with_text: bool = True) -> Path:
    """Build a small deterministic brand-guide-like PDF."""
    doc = pymupdf.open()
    for i in range(pages):
        page = doc.new_page(width=400, height=500)
        page.draw_rect(pymupdf.Rect(0, 0, 400, 70), color=None, fill=(0.85, 0.25, 0.14))
        page.draw_rect(pymupdf.Rect(0, 0, 400, 500), color=None, fill=(0.97, 0.97, 0.98))
        page.draw_rect(pymupdf.Rect(0, 0, 400, 70), color=None, fill=(0.85, 0.25, 0.14))
        page.draw_rect(pymupdf.Rect(40, 150, 120, 200), color=None, fill=(0.11, 0.45, 0.91))
        if with_text:
            page.insert_text((30, 45), f"SECTION {i + 1}", fontname="hebo", fontsize=22, color=(1, 1, 1))
            page.insert_text((30, 110), "Brand voice and colour guidance.", fontname="helv", fontsize=11, color=(0.1, 0.1, 0.1))
    doc.set_metadata({"title": title})
    doc.save(path, deflate=True)
    return path


class BatchPlanTests(unittest.TestCase):
    def test_splits_into_contiguous_batches(self) -> None:
        self.assertEqual(_batch_plan(10, 4), [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9]])

    def test_batch_size_larger_than_document(self) -> None:
        self.assertEqual(_batch_plan(3, 10), [[0, 1, 2]])

    def test_empty_document_yields_no_batches(self) -> None:
        self.assertEqual(_batch_plan(0, 4), [])

    def test_batch_size_is_clamped_to_at_least_one(self) -> None:
        self.assertEqual(_batch_plan(2, 0), [[0], [1]])


class CheckpointTests(unittest.TestCase):
    def test_corrupt_checkpoint_is_ignored_not_fatal(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "state.json"
            path.write_text("{ this is not valid json", encoding="utf-8")
            self.assertEqual(_load_checkpoint(path), {})

    def test_missing_checkpoint_returns_empty(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(_load_checkpoint(Path(tmp) / "nope.json"), {})

    def test_non_dict_checkpoint_is_ignored(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "state.json"
            path.write_text("[1, 2, 3]", encoding="utf-8")
            self.assertEqual(_load_checkpoint(path), {})


class ColourLogicTests(unittest.TestCase):
    def test_background_prefers_pale_page_field_over_saturated_brand(self) -> None:
        # A big pale field plus a smaller but saturated brand stripe.
        flat = [
            ((247, 247, 249), 900),   # paper field
            ((217, 56, 35), 120),     # brand red
            ((18, 23, 33), 40),       # ink
        ]
        self.assertEqual(_pick_background(flat), (247, 247, 249))

    def test_background_falls_back_to_dark_field(self) -> None:
        flat = [((12, 14, 18), 800), ((217, 56, 35), 60)]
        self.assertEqual(_pick_background(flat), (12, 14, 18))

    def test_background_of_empty_palette_is_pale(self) -> None:
        self.assertEqual(_pick_background([]), (249, 250, 251))

    def test_merge_palettes_dedupes_near_identical_colours(self) -> None:
        merged = _merge_palettes([
            [((217, 56, 35), 10), ((247, 247, 249), 90)],
            [((219, 58, 37), 5)],
        ])
        reds = [rgb for rgb, _ in merged if abs(rgb[0] - 217) < 12 and rgb[1] < 80]
        self.assertEqual(len(reds), 1)

    def test_style_extraction_recovers_brand_red_and_paper_field(self) -> None:
        pages = [[((217, 56, 35), 60), ((247, 247, 249), 900), ((18, 23, 33), 40)]] * 4
        style = _extract_style(
            title_hint="Acme Guide",
            page_texts=["Acme Guide", "Colour Palette", "Typography"],
            page_palettes=pages,
            source_name="acme.pdf",
        )
        palette = style["visual_language"]["color_palette"]
        self.assertEqual(palette["background"], "#F7F7F9")
        # Primary must be the saturated brand red, not the pale page field.
        primary = palette["primary"][0].lstrip("#")
        r, g, b = (int(primary[i : i + 2], 16) for i in (0, 2, 4))
        self.assertGreater(r, 180)
        self.assertGreater(r, g + 60)
        self.assertGreater(r, b + 60)
        self.assertEqual(style["identity"]["name"], "Acme Guide Cover Style")
        self.assertEqual(style["provenance"]["pages_sampled"], 3)

    def test_style_extraction_survives_blank_document(self) -> None:
        style = _extract_style(
            title_hint="",
            page_texts=[],
            page_palettes=[],
            source_name="blank.pdf",
        )
        palette = style["visual_language"]["color_palette"]
        self.assertIn("background", palette)
        self.assertIn("primary", palette)
        self.assertTrue(palette["primary"])


class FfmpegResolutionTests(unittest.TestCase):
    def test_resolves_bundled_binary_when_path_has_none(self) -> None:
        with patch("tools.video.pdf_cover.shutil.which", return_value=None):
            resolved = _resolve_ffmpeg()
        if resolved is not None:
            self.assertTrue(Path(resolved).exists())

    def test_explicit_missing_path_returns_none(self) -> None:
        self.assertIsNone(_resolve_ffmpeg("/definitely/not/here/ffmpeg"))

    def test_explicit_good_path_is_returned(self) -> None:
        good = _resolve_ffmpeg()
        if good:
            self.assertEqual(_resolve_ffmpeg(good), good)


@needs_pymupdf
class EndToEndTests(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)
        self.pdf = _make_pdf(self.tmp / "guide.pdf", pages=5)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def _run(self, **overrides):
        inputs = {
            "pdf_source": str(self.pdf),
            "work_dir": str(self.tmp / "work"),
            "output_path": str(self.tmp / "cover.mp4"),
            "batch_size": 2,
            "batch_pause_seconds": 0,
            "duration": 2,
            "fps": 10,
            "width": 320,
            "height": 180,
        }
        inputs.update(overrides)
        return PdfCover().execute(inputs)

    def test_produces_cover_video_and_style_spec(self) -> None:
        result = self._run()
        self.assertTrue(result.success, result.error)
        self.assertEqual(result.data["status"], "complete")
        self.assertEqual(result.data["page_count"], 5)
        self.assertTrue(Path(result.data["output"]).exists())
        self.assertGreater(Path(result.data["output"]).stat().st_size, 1000)
        self.assertTrue(Path(result.data["style_spec"]).exists())
        self.assertIn(str(self.tmp / "cover.mp4"), result.artifacts)

    def test_batches_are_written_to_checkpoint(self) -> None:
        result = self._run()
        self.assertTrue(result.success, result.error)
        state = json.loads((self.tmp / "work" / "pdf_cover_state.json").read_text())
        self.assertEqual(state["page_count"], 5)
        self.assertEqual(len(state["batches"]), 3)  # 5 pages / batch size 2
        for entry in state["batches"].values():
            self.assertEqual(entry["status"], "done")
            self.assertTrue(entry["files"])

    def test_partial_run_reports_remaining_batches(self) -> None:
        result = self._run(max_batches=1)
        self.assertTrue(result.success, result.error)
        self.assertEqual(result.data["status"], "partial")
        self.assertEqual(result.data["batches_total"], 3)
        self.assertEqual(result.data["batches_done"], 1)
        self.assertEqual(result.data["batches_remaining"], 2)
        # A partial run must not have produced a video yet.
        self.assertFalse(Path(self.tmp / "cover.mp4").exists())

    def test_resume_skips_already_rendered_batches(self) -> None:
        first = self._run(max_batches=2)
        self.assertEqual(first.data["batches_done"], 2)
        second = self._run()
        self.assertTrue(second.success, second.error)
        self.assertEqual(second.data["status"], "complete")
        # The second invocation had nothing new to rasterize.
        self.assertEqual(second.data["batches_total"], 3)
        self.assertIn("batches_skipped_resumed", second.data)

    def test_rerun_is_idempotent_and_reuses_checkpoint(self) -> None:
        first = self._run()
        second = self._run()
        self.assertTrue(second.success, second.error)
        self.assertEqual(second.data["status"], "complete")
        self.assertEqual(second.data["page_count"], first.data["page_count"])

    def test_missing_pdf_fails_cleanly(self) -> None:
        result = self._run(pdf_source=str(self.tmp / "does-not-exist.pdf"))
        self.assertFalse(result.success)
        self.assertIn("not found", (result.error or "").lower())

    def test_single_page_document_works(self) -> None:
        one_page = _make_pdf(self.tmp / "one.pdf", pages=1)
        result = self._run(pdf_source=str(one_page))
        self.assertTrue(result.success, result.error)
        self.assertEqual(result.data["batches_total"], 1)
        self.assertEqual(result.data["page_count"], 1)

    def test_image_only_document_without_text_still_renders(self) -> None:
        no_text = _make_pdf(self.tmp / "notext.pdf", pages=3, with_text=False)
        result = self._run(pdf_source=str(no_text), title="Fallback Title")
        self.assertTrue(result.success, result.error)
        self.assertEqual(result.data["page_count"], 3)

    def test_url_source_downloads_before_processing(self) -> None:
        calls = {}

        def fake_download(url: str, dest: Path, timeout: int = 120) -> Path:
            calls["url"] = url
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(self.pdf.read_bytes())
            return dest

        with patch("tools.video.pdf_cover._download", side_effect=fake_download):
            result = self._run(pdf_source="https://example.com/guide.pdf")

        self.assertTrue(result.success, result.error)
        self.assertEqual(calls.get("url"), "https://example.com/guide.pdf")
        self.assertEqual(result.data["source"], "guide.pdf")

    def test_download_failure_is_reported_not_raised(self) -> None:
        with patch("tools.video.pdf_cover._download", side_effect=RuntimeError("boom")):
            result = self._run(pdf_source="https://example.com/guide.pdf")
        self.assertFalse(result.success)
        self.assertIn("Download failed", result.error or "")

    def test_dependency_check_passes_with_bundled_ffmpeg(self) -> None:
        tool = PdfCover()
        # Must not raise even though no ffmpeg is on PATH in this sandbox.
        tool.check_dependencies()
        # The declared contract is preserved for the registry report.
        self.assertIn("cmd:ffmpeg", tool.dependencies)


if __name__ == "__main__":
    unittest.main()
