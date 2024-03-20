import { describe, expect, test } from "vitest";
import { NicknamesCleaner } from "../../src/tasks/NicknamesCleaner.ts";

describe("NicknameCleaner", function () {
  test.each([
    ["la niñÁ", "la ninA"],
    ["-🦅PoLyKer®〽", "PoLyKer"],
    ["$imon", "Simon"],
    ["M'arc", "M'arc"],
    ["M.arc", "M.arc"],
    ["M_arc", "M_arc"],
    ["Marc03", "Marc03"],
    ["Arnø", "Arno"],
    ["0Arnø", "Arno"],
    ["BΔNΞ", "BANE"],
    ["_maroune", "maroune"],
    ["[Bleu] test", "Bleu test"],
    ["Adaze_dev_", "Adaze_dev"],
  ])(`"%s" -> "%s"`, (source, expected) => {
    expect(NicknamesCleaner.cleanUsername(source)).toBe(expected);
  });

  test.each([
    ["la niñÁ", true],
    ["la _ nina", false],
    ["0Jean", true],
  ])(`"%s" has special caracters ? %s`, (source, expected) => {
    expect(NicknamesCleaner.needsCleaning(source)).toBe(expected);
  });
});
