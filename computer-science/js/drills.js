/* ==========================================================================
   stay add. Computer Science — exam practice: Calculate it
   StayAdd.drills[lesson][topic] = [question types]
   Drawn by assets/js/practice.js, which explains every field. Binary answers
   may be typed with or without leading zeros and spaces (unless 8 bits are needed).
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.drills = SA.drills || {};
  const F = (n, sf) => SA.fmt(n, sf);
  const bin8 = (n) => (n & 255).toString(2).padStart(8, "0");
  const nib = (s) => s.replace(/(.{4})(?=.)/g, "$1 ");
  const clean = (t) => String(t).replace(/\s+/g, "");
  const isBin = (t) => /^[01]+$/.test(clean(t));
  const binIs = (n) => (typed) => !isBin(typed) ? "Use only 0s and 1s." : parseInt(clean(typed), 2) === n || "Not quite — check each place value: 128, 64, 32, 16, 8, 4, 2, 1.";
  const places = (n) => bin8(n).split("").map((b, i) => (b === "1" ? 128 >> i : 0)).filter(Boolean);

  Object.assign(SA.drills, {
    "cs-data-representation": {
      "numbers": [
        { id: "den-bin", title: "Denary to binary",
          v: ({ r }) => ({ n: r(1, 255) }),
          q: ({ n }) => `Convert the denary number ${n} into 8-bit binary.`,
          a: ({ n }) => nib(bin8(n)), check: (t, { n }) => binIs(n)(t),
          steps: ({ n }) => [`Place values: 128 64 32 16 8 4 2 1`, `${n} = ${places(n).join(" + ")}`, `Put a 1 under each of those, 0 everywhere else`] },
        { id: "bin-den", title: "Binary to denary",
          v: ({ r }) => ({ n: r(1, 255) }),
          q: ({ n }) => `Convert the binary number ${nib(bin8(n))} into denary.`,
          a: ({ n }) => n, unit: "", tol: 0,
          steps: ({ n }) => [`Place values: 128 64 32 16 8 4 2 1`, `Add the place values with a 1: ${places(n).join(" + ")}`] },
        { id: "hex-den", title: "Hexadecimal to denary",
          v: ({ r }) => ({ n: r(16, 255) }),
          q: ({ n }) => `Convert the hexadecimal number ${n.toString(16).toUpperCase()} into denary.`,
          a: ({ n }) => n, unit: "", tol: 0,
          steps: ({ n }) => { const h = n.toString(16).toUpperCase(); return [`Hex place values: 16 and 1. A–F mean 10–15`, `${h[0]} × 16 + ${h[1]} × 1 = ${parseInt(h[0], 16) * 16} + ${parseInt(h[1], 16)}`]; },
          traps: ({ n }) => /[a-f]/.test(n.toString(16)) ? [] : [[+n.toString(16), "You read the hex digits as a denary number. The left digit is worth 16 times its value."]] },
        { id: "den-hex", title: "Denary to hexadecimal",
          v: ({ r }) => ({ n: r(16, 255) }),
          q: ({ n }) => `Convert the denary number ${n} into hexadecimal.`,
          a: ({ n }) => n.toString(16).toUpperCase(),
          check: (t, { n }) => !/^[0-9a-f]+$/i.test(clean(t)) ? "Use the digits 0–9 and A–F." : parseInt(clean(t), 16) === n || "Not quite. Divide by 16: the whole number is the first digit, the remainder the second.",
          steps: ({ n }) => [`${n} ÷ 16 = ${Math.floor(n / 16)} remainder ${n % 16}`, `${Math.floor(n / 16)} → ${Math.floor(n / 16).toString(16).toUpperCase()}, ${n % 16} → ${(n % 16).toString(16).toUpperCase()}`] },
        { id: "bin-add", title: "Binary addition",
          v: ({ r }) => { const a = r(1, 200); return { a, b: r(1, 255 - a) }; },
          q: ({ a, b }) => `Add the 8-bit binary numbers ${nib(bin8(a))} and ${nib(bin8(b))}. Give the answer in binary.`,
          a: ({ a, b }) => nib(bin8(a + b)), check: (t, { a, b }) => binIs(a + b)(t),
          steps: ({ a, b }) => [`Work right to left: 0+0 = 0, 1+0 = 1, 1+1 = 0 carry 1, 1+1+1 = 1 carry 1`, `Check in denary: ${a} + ${b} = ${a + b}`] },
        { id: "twos", title: "Two's complement",
          v: ({ r }) => ({ n: -r(1, 128) }),
          q: ({ n }) => `Write −${-n} as an 8-bit two's complement binary number.`,
          a: ({ n }) => nib(bin8(n)),
          check: (t, { n }) => !isBin(t) ? "Use only 0s and 1s." : clean(t).length !== 8 ? "Give all 8 bits: the leftmost bit carries the sign." : clean(t) === bin8(n) || "Not quite. Write the positive number in binary, flip every bit, then add 1.",
          steps: ({ n }) => [`+${-n} in binary: ${nib(bin8(-n))}`, `Flip every bit: ${nib(bin8(~(-n) & 255))}`, `Add 1: ${nib(bin8(n))}`] },
        { id: "shift", title: "Logical shift",
          v: ({ r, p }) => { const s = p([1, 2]); return { s, d: p(["left", "right"]), n: s === 2 ? r(1, 63) : r(1, 127) }; },
          q: ({ n, s, d }) => `The binary number ${nib(bin8(n))} is given a logical shift ${d} by ${s} place${s > 1 ? "s" : ""}. What is the result in denary?`,
          a: ({ n, s, d }) => (d === "left" ? (n << s) & 255 : n >> s), unit: "", tol: 0,
          steps: ({ n, s, d }) => [`${n} shifted ${d} by ${s}: ${nib(bin8(d === "left" ? (n << s) & 255 : n >> s))}`, d === "left" ? `Each place left multiplies by 2: ${n} × ${2 ** s}` : `Each place right divides by 2 and drops the remainder: ${n} ÷ ${2 ** s}, rounded down`] }
      ],
      "media": [
        { id: "colours", title: "Colours from colour depth",
          v: ({ p }) => ({ b: p([1, 2, 3, 4, 6, 8, 16]) }),
          q: ({ b }) => `An image uses a colour depth of ${b} bit${b > 1 ? "s" : ""}. How many different colours can it show?`,
          a: ({ b }) => 2 ** b, unit: "", tol: 0,
          steps: ({ b }) => [`Number of colours = 2 to the power of the colour depth`, `2^${b} = ${2 ** b}`],
          traps: ({ b }) => [[2 * b, "Use 2 to the power of the bits, not 2 × the bits."]] },
        { id: "bits-needed", title: "Bits needed for some colours",
          v: ({ r }) => ({ n: r(3, 300) }),
          q: ({ n }) => `What is the smallest colour depth that can show ${n} different colours?`,
          a: ({ n }) => Math.ceil(Math.log2(n)), unit: "bits", tol: 0,
          steps: ({ n }) => { const b = Math.ceil(Math.log2(n)); return [`Find the smallest power of 2 that is at least ${n}`, `2^${b - 1} = ${2 ** (b - 1)} is too few; 2^${b} = ${2 ** b} is enough`]; } }
      ],
      "storage": [
        { id: "image-size", title: "Image file size",
          v: ({ p }) => ({ s: p([[640, 480], [800, 600], [1024, 768], [1280, 720], [1920, 1080]]), d: p([1, 8, 16, 24]) }),
          q: ({ s, d }) => `Calculate the file size, in KiB, of a ${s[0]} × ${s[1]} pixel image with a colour depth of ${d} bit${d > 1 ? "s" : ""}.`,
          a: ({ s, d }) => (s[0] * s[1] * d) / 8 / 1024, unit: "KiB",
          steps: ({ s, d }) => [`bits = width × height × colour depth = ${s[0]} × ${s[1]} × ${d} = ${s[0] * s[1] * d}`, `bytes = bits ÷ 8 = ${(s[0] * s[1] * d) / 8}`, `KiB = bytes ÷ 1024`],
          traps: ({ s, d }) => [[(s[0] * s[1] * d) / 1024, "You forgot to divide by 8 to turn bits into bytes."], [(s[0] * s[1] * d) / 8 / 1000, "1 KiB is 1024 bytes, not 1000."]] },
        { id: "sound-size", title: "Sound file size",
          v: ({ r, p }) => ({ rate: p([8000, 11025, 22050, 44100]), res: p([8, 16]), t: r(5, 60, 5) }),
          q: ({ rate, res, t }) => `A ${t}-second mono sound is recorded at ${rate} Hz with a sample resolution of ${res} bits. Calculate the file size in MiB.`,
          a: ({ rate, res, t }) => (rate * res * t) / 8 / 1024 / 1024, unit: "MiB",
          steps: ({ rate, res, t }) => [`bits = sample rate × resolution × time = ${rate} × ${res} × ${t} = ${rate * res * t}`, `bytes = ÷ 8 = ${(rate * res * t) / 8}`, `MiB = ÷ 1024 ÷ 1024`],
          traps: ({ rate, res, t }) => [[(rate * res * t) / 1024 / 1024, "You forgot to divide by 8 to turn bits into bytes."], [(rate * res * t) / 8 / 1024, "That is in KiB. Divide by 1024 once more for MiB."]] }
      ]
    },

    "cs-data-transmission": {
      "errors": [
        { id: "parity", title: "Parity bit",
          v: ({ r, p }) => ({ n: r(0, 127), kind: p(["even", "odd"]) }),
          q: ({ n, kind }) => `A 7-bit value ${n.toString(2).padStart(7, "0")} is sent with ${kind} parity. What should the parity bit be (0 or 1)?`,
          a: ({ n, kind }) => { const ones = n.toString(2).split("1").length - 1; return kind === "even" ? ones % 2 : 1 - (ones % 2); }, unit: "", tol: 0,
          steps: ({ n, kind }) => { const ones = n.toString(2).split("1").length - 1; return [`Count the 1s: ${ones}`, `With ${kind} parity the total number of 1s, including the parity bit, must be ${kind}`]; } }
      ]
    },

    "cs-boolean-logic": {
      "tables": [
        { id: "expr", title: "Work out a logic expression",
          v: ({ r, p }) => ({ e: p([
            ["(A AND B) OR NOT C", (A, B, C) => (A & B) | (1 - C), (A, B, C) => [`A AND B = ${A & B}`, `NOT C = ${1 - C}`]],
            ["NOT (A OR B) AND C", (A, B, C) => (1 - (A | B)) & C, (A, B, C) => [`A OR B = ${A | B}`, `NOT (A OR B) = ${1 - (A | B)}`]],
            ["(A XOR B) AND C", (A, B, C) => (A ^ B) & C, (A, B, C) => [`A XOR B = ${A ^ B}`]],
            ["NOT (A AND B) OR C", (A, B, C) => (1 - (A & B)) | C, (A, B, C) => [`A AND B = ${A & B}`, `NOT (A AND B) = ${1 - (A & B)}`]],
            ["(A OR NOT B) AND (B OR C)", (A, B, C) => (A | (1 - B)) & (B | C), (A, B, C) => [`A OR NOT B = ${A | (1 - B)}`, `B OR C = ${B | C}`]]
          ]), A: r(0, 1), B: r(0, 1), C: r(0, 1) }),
          q: ({ e, A, B, C }) => `X = ${e[0]}. Find X when A = ${A}, B = ${B} and C = ${C}.`,
          a: ({ e, A, B, C }) => e[1](A, B, C), unit: "", tol: 0,
          steps: ({ e, A, B, C }) => [`Work out the brackets first`, ...e[2](A, B, C)] }
      ]
    },

    "cs-programming": {
      "concepts": [
        { id: "mod-div", title: "MOD and DIV",
          v: ({ r, p }) => ({ a: r(10, 99), b: r(2, 9), op: p(["MOD", "DIV"]) }),
          q: ({ a, b, op }) => `What is the value of ${a} ${op} ${b}?`,
          a: ({ a, b, op }) => (op === "MOD" ? a % b : Math.floor(a / b)), unit: "", tol: 0,
          steps: ({ a, b }) => [`${a} ÷ ${b} = ${Math.floor(a / b)} remainder ${a % b}`, `DIV gives the whole number part (${Math.floor(a / b)}); MOD gives the remainder (${a % b})`],
          traps: ({ a, b, op }) => [[op === "MOD" ? Math.floor(a / b) : a % b, op === "MOD" ? "That is DIV. MOD is the remainder." : "That is MOD. DIV is the whole number of times it divides."]] },
        { id: "substring", title: "SUBSTRING",
          v: ({ r, p }) => { const w = p(["COMPUTER", "ALGORITHM", "KEYBOARD", "DATABASE", "PROGRAM", "NETWORK", "VARIABLE"]); const len = r(2, 4); return { w, len, s: r(1, w.length - len + 1) }; },
          q: ({ w, s, len }) => `What does SUBSTRING("${w}", ${s}, ${len}) return? (start at position ${s}, take ${len} characters; the first character is position 1)`,
          a: ({ w, s, len }) => w.substr(s - 1, len),
          check: (t, { w, s, len }) => clean(t).replace(/"/g, "").toUpperCase() === w.substr(s - 1, len) || (clean(t).toUpperCase() === w.substr(s, len) ? "Position 1 is the first character, so start one place earlier." : "Count from position 1 and take exactly that many characters."),
          steps: ({ w, s, len }) => [`Positions: ${w.split("").map((c, i) => `${i + 1}=${c}`).join(" ")}`, `From position ${s}, take ${len}: ${w.substr(s - 1, len)}`] }
      ]
    },

    "cs-algorithms": {
      "standard": [
        { id: "linear", title: "Comparisons in a linear search",
          v: ({ r, p }) => { const list = Array.from({ length: 8 }, () => r(1, 60)); const target = p([...list, r(61, 99)]); return { list, target }; },
          q: ({ list, target }) => `A linear search looks for ${target} in the list [${list.join(", ")}], starting from the first item. How many comparisons does it make?`,
          a: ({ list, target }) => (list.indexOf(target) === -1 ? list.length : list.indexOf(target) + 1), unit: "", tol: 0,
          steps: ({ list, target }) => list.indexOf(target) === -1 ? [`${target} is not in the list, so every item is checked: ${list.length} comparisons`] : [`Check items in order until ${target} is found`, `It is item ${list.indexOf(target) + 1}, so ${list.indexOf(target) + 1} comparisons`] }
      ]
    }
  });
})();
