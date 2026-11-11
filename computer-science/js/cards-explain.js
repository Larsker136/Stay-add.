/* ==========================================================================
   stay add. Computer Science — "Explain it" flashcards: the harder deck of every topic
   Why, predict, calculate, spot the mistake — each answer shows the reasoning.
   StayAdd.explainCards["<body data-lesson>"]["<topic data-key>"] = [[question, answer], …]
   Drawn by assets/js/flashcards.js next to the Key facts deck in js/cards.js.
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.explainCards = SA.explainCards || {};

  Object.assign(SA.explainCards, {
    "cs-data-representation": {
      "numbers": [
        ["Add 1011 0110 and 0110 0111 in 8 bits. What goes wrong?", "The sum is 1 0001 1101 (182 + 103 = 285). It needs 9 bits, so the carry is lost and the register holds 0001 1101 (29) — an overflow error."],
        ["Shift 1010 0000 (160) right by 3 places. What is the result and what does it show?", "0001 0100 = 20 = 160 ÷ 8. Each right shift divides by 2."],
        ["Shift 0000 0111 (7) right by 1. Why isn't the answer 3.5?", "0000 0011 = 3: the 1 shifted off the end is lost, so the result is rounded down."],
        ["Convert 1110 1100 (two's complement) to denary.", "−128 + 64 + 32 + 8 + 4 = −20."],
        ["Why is a MAC address written in hex rather than binary?", "48 bits would be a long string of 0s and 1s; hex is 12 digits, easier to read and copy without mistakes."],
        ["How many different values can 12 bits represent?", "2¹² = 4096 (0 to 4095)."],
        ["Convert 2F (hex) to denary and binary.", "2 × 16 + 15 = 47; 0010 1111."],
        ["Convert 0011 1100 to hex.", "0011 = 3, 1100 = C, so 3C."],
        ["Convert 156 to 8-bit binary.", "1001 1100 (128 + 16 + 8 + 4)."],
        ["Add 0101 0011 and 0010 1110.", "1000 0001 (83 + 46 = 129)."],
        ["Shift 0001 0110 (22) left by 2. What is the result?", "0101 1000 = 88 — multiplied by 4."],
        ["Convert −1 to 8-bit two's complement.", "1111 1111 (−128 + 127)."],
        ["Why does a left shift sometimes give the wrong answer?", "Bits shifted out of the leftmost position are lost, so the result can overflow."],
        ["Convert FF (hex) to denary.", "15 × 16 + 15 = 255."],
        ["How do you tell whether an 8-bit two's complement number is negative?", "The leftmost (most significant) bit is 1."],
        ["Convert 1010 1010 to hex.", "1010 = A, so AA."],
        ["Why does an 8-bit register overflow when adding 200 and 100?", "300 is more than 255, the largest value 8 bits can hold."]
      ],
      "media": [
        ["Why does an 8-bit colour depth image look worse than a 24-bit one?", "8 bits give only 256 colours, so subtle shades are replaced by the nearest available colour; 24 bits give about 16.7 million."],
        ["Explain why a higher sample rate makes a recording sound closer to the original.", "Measuring the wave more often captures more detail of its shape, so the stored samples follow the real wave more closely."],
        ["Why do characters have codes in order (A = 65, B = 66…)?", "So text can be sorted by comparing codes, and letters can be converted (e.g. a = A + 32)."],
        ["Why does Unicode use more bits per character than ASCII?", "It must represent many more characters — every alphabet, symbols and emoji — which needs more than 128 or 256 codes."],
        ["Doubling the resolution (width and height) of an image does what to its file size?", "Width × 2 and height × 2 → 4 times as many pixels, so about 4 times the file size."],
        ["Why can't a computer store an analogue sound wave exactly?", "It can only store a finite number of samples, each with a finite number of bits, so values between samples and between levels are lost."],
        ["A sound is sampled with 3-bit resolution. How many different amplitude values can be stored?", "2³ = 8."],
        ["Why does a low sample rate miss detail in sound?", "Changes in the wave between samples are not recorded."],
        ["Why might a website use lower-resolution images?", "Smaller files load faster and use less bandwidth."],
        ["How many bits are needed to give 100 different colours?", "7 bits (2⁷ = 128; 6 bits give only 64)."],
        ["ASCII for ‘A’ is 65. What is ‘D’?", "68 — letters are coded in sequence."],
        ["Why does doubling colour depth from 8 to 16 bits double the file size?", "Each pixel now needs twice as many bits."],
        ["A 1-bit image is enlarged. Why does it look blocky?", "Each pixel is stretched over a bigger area; no new detail is created."],
        ["Why is a higher sample resolution more accurate?", "Each sample's amplitude is stored to more possible values, closer to the real wave."]
      ],
      "storage": [
        ["Calculate the size of a 30-second mono recording at 44 100 Hz, 16-bit, in MiB.", "44 100 × 16 × 30 = 21 168 000 bits ÷ 8 = 2 646 000 bytes ÷ 1024 ÷ 1024 ≈ 2.52 MiB."],
        ["Compress BBBBWWWWWWBB with run-length encoding. Why is it lossless?", "4B 6W 2B. The original can be rebuilt exactly from the value–count pairs."],
        ["Why would RLE make a photograph bigger, not smaller?", "Photos rarely have long runs of identical pixels, so each pixel would need a value and a count — more data than before."],
        ["Why is lossy compression acceptable for music streaming but not for a program file?", "Removed sound details are hard to hear; but one changed bit in a program could make it crash or behave wrongly."],
        ["How does lossy compression reduce an image file?", "It permanently removes detail the eye barely notices — e.g. reduces colour depth or merges similar-coloured pixels."],
        ["A 1024 × 768 image has 24-bit colour. Find the size in MiB.", "1024 × 768 × 24 = 18 874 368 bits ÷ 8 = 2 359 296 bytes ÷ 1024² = 2.25 MiB."],
        ["Find the size of a 100 × 100 image with 1-bit colour, in bytes.", "10 000 bits ÷ 8 = 1250 bytes."],
        ["A 10-second stereo sound at 8000 Hz, 8-bit. Find the size in bytes.", "8000 × 8 × 10 × 2 = 1 280 000 bits = 160 000 bytes."],
        ["Apply RLE to AAABBBBBBC.", "3A 6B 1C."],
        ["Why is lossless compression used for spreadsheets?", "Every value must be restored exactly; losing data would change the figures."],
        ["Why is a JPEG of a photo much smaller than a bitmap?", "It discards detail the eye barely notices and groups similar colours."],
        ["A file is 3 MiB. How many KiB is that?", "3 × 1024 = 3072 KiB."],
        ["Why does a compressed file send faster over a network?", "Fewer bits need to be transmitted."],
        ["A 2 MiB file is sent at 1 MiB per second. How long does it take?", "2 seconds."]
      ]
    },

    "cs-data-transmission": {
      "methods": [
        ["Why might packets of the same file arrive out of order?", "Each packet is routed independently; some take longer or busier routes, so they arrive at different times. The packet number lets them be reordered."],
        ["Why is serial transmission used for long distances although parallel is faster?", "In parallel, bits on different wires can arrive at slightly different times (skew) and wires interfere; serial uses one wire, so it is reliable over distance."],
        ["Which method suits a walkie-talkie, and why?", "Half-duplex: both can talk, but only one at a time."],
        ["Which method suits a phone call, and why?", "Full-duplex: both people can talk and hear at the same time."],
        ["Give one benefit and one drawback of packet switching.", "Benefit: if a route fails or is busy, packets go another way. Drawback: packets can be lost or delayed and must be reassembled."],
        ["Why does a packet need the originator's address?", "So the receiver knows where to send replies or requests for missing packets."],
        ["Which transmission method does a TV broadcast use? Why?", "Simplex — data only goes one way, from broadcaster to TV."],
        ["Why does a packet header include a packet number?", "So the receiver can reassemble the packets in the right order."],
        ["Why is parallel transmission used inside a computer?", "Distances are short, so skewing is not a problem, and it is fast."],
        ["Why doesn't a USB keyboard usually need a driver installed by hand?", "The OS recognises the device type when it is plugged in and loads a standard driver automatically."],
        ["Why might a packet never arrive?", "It may be lost or corrupted on the way, e.g. if a router fails."],
        ["Why is packet switching efficient for a network?", "Many users share the same links; no line is reserved for one connection."],
        ["Why is a printer cable often half-duplex?", "Data can go both ways (data and status) but not at the same time."],
        ["Why is full-duplex needed for a video call?", "Both people must send and receive audio and video at the same time."]
      ],
      "errors": [
        ["Even parity is used. 1011 0010 arrives. Is there an error?", "It has four 1s — even — so no error is detected (though an even number of flipped bits could still be hidden)."],
        ["Even parity: 1101 0110 arrives. Is there an error?", "Five 1s — odd — so an error has occurred."],
        ["How does a parity block find which bit is wrong?", "Each row and each column has a parity bit; the wrong bit is where the row that fails and the column that fails cross."],
        ["Why is a checksum better than a single parity bit for large blocks?", "It is calculated from all the data in the block, so it detects many more errors, including several flipped bits."],
        ["Why is an echo check slow and not completely reliable?", "Data is sent twice (doubling traffic), and an error could happen on the way back instead of on the way there."],
        ["A check digit detects transposition errors. What is that, and why does it matter?", "Two digits swapped, e.g. 1243 typed as 1423. The weighted calculation gives a different check digit, so the mistake is caught."],
        ["Does a check digit detect transmission errors?", "No — it detects data entry errors (wrongly typed codes). Parity, checksums and echo checks detect transmission errors."],
        ["Odd parity: 1100 1100 arrives. Is there an error?", "Four 1s — even — so yes, there is an error."],
        ["Add an even parity bit (at the left) to 101 0011.", "Four 1s already, so the parity bit is 0: 0101 0011."],
        ["Why can't a parity bit detect two flipped bits?", "Two changes keep the number of 1s even (or odd), so the check still passes."],
        ["How does a checksum detect an error?", "The receiver recalculates the checksum; if it differs from the one sent, the data is resent."],
        ["Why is ARQ useful over unreliable networks?", "Lost or damaged packets are automatically resent until they arrive correctly."],
        ["Why is an echo check twice as slow?", "All the data must travel back to the sender to be compared."],
        ["Which error check would spot 1234 typed as 1243?", "A check digit — it detects transposition errors."],
        ["Why is a checksum calculated by both sender and receiver?", "Comparing the two values shows whether the data changed on the way."]
      ],
      "encryption": [
        ["Why is asymmetric encryption used to send a symmetric key over the internet?", "The symmetric key is encrypted with the receiver's public key; only their private key can decrypt it, so the key can't be read if intercepted."],
        ["A hacker intercepts encrypted bank data. What can they do with it?", "They have the data, but without the key it is meaningless ciphertext — they can't understand it (they could still delete it)."],
        ["Why doesn't the public key need to be kept secret?", "It can only encrypt; decrypting needs the matching private key, which never leaves its owner."],
        ["Why is symmetric encryption still used?", "It is much faster than asymmetric, so once a key is shared safely, it encrypts the rest of the data."],
        ["Encrypt HELLO with a Caesar shift of 3. Why is this weak?", "KHOOR. There are only 25 possible shifts, so all can be tried quickly (brute force)."],
        ["Alice wants to send Bob a secret message using asymmetric encryption. Which key does she use?", "Bob's public key; only Bob's private key can decrypt it."],
        ["Decrypt KHOOR with a Caesar shift of 3.", "HELLO."],
        ["Why is the same key used for both directions a weakness in symmetric encryption?", "Anyone who gets the key can read every message and send fake ones."],
        ["Why is encrypted data still useless to a hacker without the key?", "It looks like random characters, and it would take too long to try every key."],
        ["Why is symmetric encryption faster than asymmetric?", "Its algorithms are simpler and need less processing."],
        ["Why should Wi-Fi networks use encryption?", "Radio signals can be picked up by anyone nearby."],
        ["Why can't a public key be used to decrypt a message it encrypted?", "Only the matching private key can decrypt it."]
      ]
    },

    "cs-hardware": {
      "architecture": [
        ["Describe the role of the MAR and MDR when the CPU reads from memory.", "The address to read is placed in the MAR and sent along the address bus; the contents of that address come back along the data bus into the MDR."],
        ["Why is the PC incremented during the fetch stage?", "So it holds the address of the next instruction, ready for the next cycle."],
        ["Why does more cache improve performance?", "Cache is very fast memory next to the CPU; storing frequently used data there avoids slower trips to RAM."],
        ["A dual-core 2 GHz CPU vs a single-core 3 GHz CPU — which is faster?", "It depends: the dual-core can run two tasks at once, but for one task that can't be split, the 3 GHz single core may be faster."],
        ["Why is the address bus one-way but the data bus two-way?", "Only the CPU sends addresses to memory; data travels both ways (reading and writing)."],
        ["Why does a washing machine use an embedded system rather than a PC?", "It needs only one dedicated task; an embedded system is cheaper, smaller, uses less power and is reliable."],
        ["What does the ALU do with ‘ADD 5’ during execute?", "It adds 5 to the value in the accumulator and stores the result back in the accumulator."],
        ["Describe the fetch stage step by step.", "PC → MAR; address sent on address bus; instruction returned on data bus to MDR; MDR → CIR; PC incremented."],
        ["Why does a higher clock speed make a computer faster?", "More instructions can be fetched and executed each second."],
        ["Why can a high clock speed cause problems?", "The CPU gets hotter and may need more cooling or become unstable."],
        ["Why is cache faster than RAM?", "It is closer to the processor and made of faster memory."],
        ["Why is a central heating controller an embedded system?", "It is a computer inside a larger device, built for one dedicated task."],
        ["Why do instructions and data share one memory in von Neumann architecture?", "That is the stored program concept — both are held in main memory as binary."],
        ["A program runs on one core only. Will a quad-core CPU make it four times faster?", "No — the program can't split its work across cores, so only one is used."],
        ["Why is the result of a calculation held in the accumulator first?", "So it can be used straight away in the next calculation or stored in memory."]
      ],
      "devices": [
        ["Explain how a touch screen (capacitive) detects a touch.", "Your finger conducts and changes the electrical charge at that point; sensors detect the change and calculate its position."],
        ["How does an inkjet printer differ from a laser printer?", "Inkjet sprays tiny droplets of liquid ink from nozzles as the head moves across the paper; laser uses a charged drum and powdered toner fused by heat — faster for large volumes."],
        ["Why would a 3D printer be used in medicine?", "To make custom-shaped objects such as prosthetic limbs or implants, built up layer by layer."],
        ["Describe how a burglar alarm uses a sensor.", "An infrared (or pressure) sensor sends readings; an ADC converts them; the microprocessor compares them with stored values and, if movement is detected, sounds the alarm."],
        ["Why does a microphone need an ADC?", "It produces an analogue electrical signal; the computer can only process digital data."],
        ["How does an LCD screen produce colour?", "A backlight shines through liquid crystals that twist to block or let through light, and red, green and blue filters make each pixel's colour."],
        ["Why are capacitive screens used on phones instead of resistive?", "They are more responsive, support multi-touch and give a clearer image."],
        ["Why can't a capacitive screen detect a gloved finger?", "It needs a conductor to change the electric field; normal gloves insulate."],
        ["Which sensor would a smart irrigation system use? Why?", "A moisture sensor, to detect when the soil is dry."],
        ["Why is a laser printer better for printing many pages?", "It prints fast and the toner lasts longer than ink cartridges."],
        ["Why does a barcode need a check digit?", "So the scanner can check the code was read correctly."],
        ["Which sensor would a car parking system use?", "An infrared or ultrasonic (proximity) sensor to detect distance."],
        ["Why do speakers need a DAC?", "Sound is stored as digital data, but a speaker needs an analogue signal to vibrate."],
        ["Why are LED screens more energy efficient than older LCD backlights?", "LEDs need less power and light up instantly."]
      ],
      "storage": [
        ["Why does a computer need both RAM and secondary storage?", "RAM is fast so the CPU can access running programs quickly, but it is volatile; secondary storage keeps files permanently when the power is off."],
        ["Why is ROM used to store the bootloader?", "It is non-volatile and can't be accidentally changed, so the instructions to start the computer are always there."],
        ["Choose storage for a photographer travelling: SSD, HDD or DVD? Justify.", "SSD (or flash memory): no moving parts so it survives knocks, fast, light, and large capacity."],
        ["Why is virtual memory slow?", "Secondary storage is much slower than RAM, and data must be swapped back into RAM before the CPU can use it."],
        ["How does an optical disc store data?", "A laser burns or reads pits and lands on the surface; the reflected light differs, representing 1s and 0s."],
        ["How does a magnetic hard disk read data?", "Platters spin; a read/write head moves across them and detects magnetised areas representing 1s and 0s."],
        ["Give two risks of storing personal data in the cloud.", "It depends on the provider's security (data could be hacked), and you can't access it without the internet."],
        ["Why is magnetic storage still used in data centres?", "It is cheap for very large capacities."],
        ["How can disk thrashing be reduced?", "Add more RAM so less data needs swapping to virtual memory."],
        ["Why are optical discs less used today?", "They have small capacities and are slower than flash storage and streaming."],
        ["Why does an SSD use less power than an HDD?", "It has no moving parts — no spinning platters or moving heads."],
        ["Why is ROM non-volatile?", "Its contents are written permanently and kept without power, so the computer can start up."],
        ["Why might a company back up to cloud storage?", "Data is stored off-site, so it survives fire or theft at the office."],
        ["Why is virtual memory needed?", "When RAM is full, part of secondary storage is used as extra memory so programs can keep running."],
        ["Why do mobile phones use solid-state storage?", "It is small, light, robust and uses little power."]
      ],
      "network": [
        ["Why can't MAC addresses be used to route data across the internet?", "They identify hardware but say nothing about location; IP addresses are organised so routers know where to send packets."],
        ["Why is IPv6 needed?", "IPv4's 32 bits give about 4.3 billion addresses — not enough for all devices. IPv6's 128 bits give vastly more."],
        ["Why should a web server have a static IP address?", "So its address never changes and DNS records keep pointing to it."],
        ["Is 192.168.1.300 a valid IPv4 address? Explain.", "No — each part is 8 bits, so the maximum is 255."],
        ["What happens to a laptop's IP and MAC addresses when it moves from home to school Wi-Fi?", "The MAC address stays the same; it gets a new (dynamic) IP address from the school's router."],
        ["How does a router know where to send a packet?", "It reads the destination IP address and looks it up in its routing table to choose the next hop."],
        ["Write an example of a valid IPv4 address.", "e.g. 192.168.0.12 — four numbers 0–255 separated by dots."],
        ["Why are dynamic IP addresses useful for an ISP?", "Addresses can be reused when devices disconnect, saving addresses."],
        ["Why does a router need both a MAC and an IP address?", "IP routes data between networks; MAC delivers it to the right device on the local network."],
        ["Why is a static IP address more expensive?", "It is permanently reserved for one user."],
        ["How many possible IPv4 addresses are there?", "2³² — about 4.3 billion."],
        ["Why can two homes both have devices with address 192.168.1.2?", "That is a private address used only inside each home network."],
        ["Why does a router keep a routing table?", "To decide the best next hop for each packet."]
      ]
    },

    "cs-software": {
      "types": [
        ["Explain how the OS allows several programs to run ‘at the same time’ on one core.", "Multitasking: the OS gives each program a short time slice of the processor in turn, switching so quickly it seems simultaneous."],
        ["Why does the CPU save the contents of its registers before handling an interrupt?", "So it can restore them afterwards and carry on the original task exactly where it stopped."],
        ["A printer runs out of paper while a user types. Describe what happens.", "The printer sends a hardware interrupt; at the end of the current cycle the CPU checks priority, saves its state, runs the ISR (e.g. shows a warning), then restores and continues."],
        ["Why does an OS need to manage memory?", "So each program gets its own RAM and programs don't overwrite each other's data; it also uses virtual memory when RAM is full."],
        ["Is a device driver system or application software? Why?", "System software: it lets the OS communicate with a hardware device; the user doesn't use it directly for a task."],
        ["Why is the OS loaded by firmware rather than already in RAM?", "RAM is volatile and empty at switch-on, so the bootloader in ROM must load the OS from secondary storage."],
        ["Why is defragmenting an SSD unnecessary?", "Any location is accessed equally fast, and extra writes shorten its life."],
        ["Why does the OS need to manage peripherals?", "So programs can use devices like printers without knowing how each one works."],
        ["Give a reason an interrupt may have a high priority.", "It needs urgent attention, e.g. power failure or hardware error."],
        ["Why does a GUI suit beginners better than a CLI?", "Icons and menus are easy to learn; no commands need to be remembered."],
        ["Why might a technician use a command-line interface?", "Commands are faster, use fewer resources and can be scripted."],
        ["What happens to lower-priority interrupts while one is being handled?", "They wait in a queue until the current ISR finishes."],
        ["Why does the OS provide user accounts?", "To manage security — each user has their own files and access rights."],
        ["Why is a virus checker run regularly?", "New malware may arrive at any time, and definitions are updated often."]
      ],
      "languages": [
        ["Why can't the CPU run Python code directly?", "The CPU only understands machine code in its instruction set; Python must be translated first by an interpreter or compiler."],
        ["Why might a games company distribute a compiled executable?", "It runs fast without a translator, and users can't easily read or copy the source code."],
        ["A program has errors on lines 5 and 40. How would a compiler and an interpreter report them?", "A compiler reports both after translating the whole program; an interpreter stops at line 5 and reports only that error."],
        ["Why is assembly language used for some device drivers?", "It gives direct control of hardware and special CPU instructions, and produces fast, compact code."],
        ["Why is a high-level language portable but machine code is not?", "High-level code can be translated for any CPU; machine code is specific to one processor's instruction set."],
        ["How do breakpoints help a programmer find a logic error?", "The program pauses at a chosen line so the programmer can inspect variable values and step through line by line to see where it goes wrong."],
        ["Why is an interpreter useful during development?", "It stops at the first error and shows where it is, so it can be fixed straight away."],
        ["Why does a compiled program run faster than an interpreted one?", "It has already been translated; an interpreter translates each line every time it runs."],
        ["Why does a user need an interpreter installed to run Python code?", "The code is translated line by line as it runs, so the interpreter must be present."],
        ["Why is it hard to copy someone's compiled program?", "Users get machine code, not readable source code."],
        ["Why does each assembly instruction usually match one machine code instruction?", "Assembly is a low-level language that uses mnemonics for machine code."],
        ["Why is a high-level language easier to debug?", "It uses English-like words and has built-in tools to help find errors."],
        ["Why does a compiler report all errors at once?", "It translates the whole program before anything runs."],
        ["Why can't an executable made for one type of CPU run on another?", "Its machine code is specific to that CPU's instruction set."]
      ]
    },

    "cs-internet": {
      "web": [
        ["Explain step by step what happens when you type a URL.", "Browser sends the domain to a DNS → DNS returns the IP address → browser sends an HTTP(S) request to that web server → server sends the HTML → browser renders it."],
        ["Why do we use domain names instead of IP addresses?", "They are easier for people to remember; the DNS translates them to IP addresses."],
        ["Why should you check for HTTPS before entering card details?", "HTTPS encrypts the data with SSL/TLS, so if it is intercepted it is meaningless."],
        ["Why might a DNS server not know an IP address immediately?", "It may not have that domain in its records, so it passes the request to another DNS server higher up."],
        ["How can cookies raise privacy concerns?", "Third-party cookies track sites you visit to build a profile for targeted adverts, often without you realising."],
        ["Why are session cookies used for shopping baskets?", "They remember items only while you browse; they are deleted when the browser closes, so nothing is kept long term."],
        ["Split https://www.shop.com/sale into its parts.", "Protocol: https; domain: www.shop.com; file/page: /sale."],
        ["What happens if a DNS server can't find a domain name?", "It passes the request to another DNS server higher up."],
        ["Why does a website remember your language choice next visit?", "A persistent cookie stores the preference on your device."],
        ["Why are session cookies deleted when the browser closes?", "They are only needed for one visit, e.g. to track a basket."],
        ["Why is HTTP unsafe on public Wi-Fi?", "Data is sent unencrypted, so anyone intercepting it can read it."],
        ["What does the browser send back to the web server after DNS lookup?", "A request for the web page to the server's IP address."],
        ["Why can sharing the same IP address for many sites still work?", "The server uses the domain name in the request to pick the right site."],
        ["Why do browsers keep a history?", "So users can revisit pages quickly and go back and forward."]
      ],
      "currency": [
        ["Explain why changing one old transaction in a blockchain would be noticed.", "Changing it changes that block's hash, so the next block's ‘previous hash’ no longer matches — and every later block breaks. The copies on other computers also disagree."],
        ["Why is a blockchain described as decentralised?", "No single bank or organisation controls it; copies are held and checked by many computers in the network."],
        ["Give one advantage and one disadvantage of digital currency.", "Advantage: fast transfers without a bank, worldwide. Disadvantage: values can change sharply, and lost keys mean lost money."],
        ["What does a timestamp in each block show?", "When the transaction was recorded, putting blocks in a fixed order."],
        ["Is a payment by bank card the same as a digital currency? Explain.", "No — card payments move ordinary money controlled by banks; a digital currency exists only electronically and may be decentralised."],
        ["Why would changing a block change its hash?", "The hash is calculated from all the block's data; any change gives a different hash."],
        ["Why does a broken hash link reveal tampering?", "The next block still holds the old hash, which no longer matches."],
        ["Why is a digital currency harder to fake than cash?", "Every transaction is verified and recorded on the blockchain across many computers."],
        ["Why do some people worry about cryptocurrency?", "Its value changes a lot, it is unregulated and can be used for crime."],
        ["Why does a blockchain need many copies?", "If one copy is changed, it doesn't match the others, so the fake is rejected."],
        ["Why can a digital currency be sent abroad quickly?", "There is no bank in the middle; the transaction is recorded directly on the network."],
        ["Why is a blockchain called a ‘chain’?", "Each block is linked to the previous one by its hash."]
      ],
      "security": [
        ["Explain why a long password with mixed characters resists brute force.", "Each extra character multiplies the number of combinations; more possible characters (letters, digits, symbols) multiply it further, so trying them all takes too long."],
        ["How does two-step verification protect an account even if the password is stolen?", "The attacker also needs a second factor, such as a code sent to your phone, which they don't have."],
        ["How does a DDoS attack stop a website working?", "Thousands of infected computers (a botnet) send so many requests that the server can't respond to genuine users."],
        ["A user receives an email ‘from their bank’ asking them to log in via a link. What attack is it and how should they respond?", "Phishing. Don't click the link; check the sender, and go to the bank's site by typing the address or calling the bank."],
        ["Why does keeping software updated improve security?", "Updates patch vulnerabilities that hackers or malware could exploit."],
        ["How does a proxy server help protect a network?", "It sits between users and the internet, hiding their IP addresses and filtering harmful traffic and websites."],
        ["Why is a worm more dangerous than a virus on a network?", "It spreads by itself to other computers without anyone running it."],
        ["How could a firewall stop a hacker?", "It examines incoming and outgoing traffic and blocks anything that breaks its rules."],
        ["Why do websites lock accounts after several failed logins?", "To stop brute-force attacks trying many passwords."],
        ["How does a CAPTCHA protect a website?", "It checks that a person, not an automated bot, is using it."],
        ["Why is regular backup a defence against ransomware?", "Data can be restored without paying the ransom."],
        ["How might social engineering trick a user into revealing a password?", "Someone poses as IT support on the phone and asks for it to ‘fix a problem’."],
        ["Why are biometrics harder to steal than passwords?", "Body features are unique to each person and can't easily be guessed or shared."],
        ["Why is it risky to use the same password everywhere?", "If one site is breached, attackers can get into all your accounts."]
      ]
    },

    "cs-emerging-tech": {
      "automated": [
        ["Describe how an automated system keeps a fish tank at 25 °C.", "A temperature sensor sends readings, converted by an ADC; the microprocessor compares them with 25 °C; below it, it turns the heater on, above it, off — repeating continuously."],
        ["Why is automation used in nuclear power stations?", "Sensors and actuators react faster and more reliably than people, and people are kept away from dangerous areas."],
        ["Give one disadvantage of automated traffic lights.", "They can fail if a sensor breaks, causing jams or accidents; they are expensive to install and maintain."],
        ["Why does an automated system need stored preset values?", "The microprocessor needs something to compare the sensor readings with to decide whether to act."],
        ["Why is the process called a feedback loop?", "The result of the action changes the conditions, which the sensor measures again, so the system keeps correcting itself."],
        ["Describe how an automatic street light works.", "A light sensor sends readings via an ADC; the microprocessor compares them to a preset value and switches the light on when it gets dark."],
        ["Why does an automated greenhouse keep taking readings after the window opens?", "So it can close the window once the temperature returns to the preset value."],
        ["Why might an automated system fail?", "A faulty sensor, power cut, software bug or hacking."],
        ["Give an advantage of automated weather stations.", "They take readings continuously in remote or dangerous places without people."],
        ["Why is automation used in factories?", "It is faster, more consistent and works 24/7, reducing costs."],
        ["Why does an automated system cost a lot at first?", "Sensors, actuators, microprocessors and installation are expensive."],
        ["Why must an automated system's sensors be checked regularly?", "A faulty sensor gives wrong readings, so the system responds wrongly."]
      ],
      "robotics": [
        ["Why is a robot vacuum cleaner a robot but a remote-controlled car isn't?", "The vacuum has sensors, a microprocessor and a program that controls its movement; the car's movement is controlled by a human."],
        ["Why are robots used for welding cars?", "They work continuously, repeat precise welds consistently, and protect workers from heat and fumes."],
        ["Give a limitation of robots in a hospital.", "They can only do what they are programmed for and can't respond to unexpected situations as a surgeon could; they are very expensive."],
        ["Why might factory robots increase unemployment but create other jobs?", "They replace manual workers, but new jobs appear in designing, programming and maintaining robots."],
        ["What role do sensors play in a robot arm?", "They detect position, pressure or objects so the microprocessor can adjust movements accurately."],
        ["Why can a robot work in dangerous places such as a bomb site?", "No human life is put at risk."],
        ["Why do robots produce more consistent products?", "They do the same movement precisely every time and don't tire."],
        ["Why might a robot struggle with unusual tasks?", "It only follows its program; it can't easily deal with situations it wasn't programmed for."],
        ["Why do robots need maintenance staff?", "They break down and need repairs, updates and reprogramming."],
        ["Why are drones useful for delivering medicine to remote areas?", "They can fly over difficult terrain quickly without a driver."],
        ["Is a self-driving car a robot? Explain.", "Yes — it has a mechanical structure, sensors and actuators, and is programmable."],
        ["Why are robots used for packing in warehouses?", "They work quickly, accurately and around the clock."]
      ],
      "ai": [
        ["Explain how an expert system diagnoses a car fault.", "The user answers questions through the interface; the inference engine applies rules from the rule base to facts in the knowledge base and outputs the likely fault and a probability."],
        ["How is machine learning different from an expert system?", "An expert system follows fixed rules written by experts; machine learning finds its own patterns from data and changes its rules to improve."],
        ["How does a spam filter ‘learn’?", "It is trained on many emails labelled spam or not; it finds patterns, and when users mark more emails it updates its rules."],
        ["Why does machine learning need large amounts of data?", "More examples let it find reliable patterns and make more accurate predictions."],
        ["Give one ethical concern about AI.", "Bias from unrepresentative training data, lack of accountability for decisions, or job losses."],
        ["Is a calculator an example of AI? Explain.", "No — it follows fixed instructions; it doesn't reason from data or learn and adapt."],
        ["Why is an expert system useful when no specialist is available?", "It gives expert-level advice by applying rules gathered from experts."],
        ["Why might a doctor not fully trust an expert system?", "It only knows what was programmed in and can't use judgement or spot unusual cases."],
        ["How does a video platform use machine learning to recommend videos?", "It learns patterns from what you and similar users watched and predicts what you'll like."],
        ["Why can biased training data make AI unfair?", "The system learns patterns in the data, including the bias."],
        ["Why does an expert system explain its reasoning?", "So users can understand and check how a conclusion was reached."],
        ["Why is a chess program that improves by playing itself an example of machine learning?", "It changes its own behaviour based on the results of previous games."],
        ["Why is it important to test AI with new data it hasn't seen?", "To check it works in real situations, not just on its training data."]
      ]
    },

    "cs-algorithms": {
      "cycle": [
        ["Which stage is ‘writing a structure diagram’ and which is ‘choosing test data’?", "Structure diagram: design. Choosing and running test data: testing."],
        ["Apply abstraction to a school timetable app.", "Keep what matters — lessons, rooms, teachers, times; leave out details like room colour or teachers' ages."],
        ["Decompose a ‘quiz program’.", "e.g. load questions, ask a question, check the answer, keep score, show results — each solved separately."],
        ["Why do programmers go back to earlier stages of the life cycle?", "Testing may reveal errors or missing requirements, which need redesign or recoding."],
        ["Identify the inputs, processes, outputs and storage of a cash machine.", "Inputs: card, PIN, amount. Processes: check PIN and balance. Outputs: cash, receipt, screen messages. Storage: account balances."],
        ["Which stage does ‘writing pseudocode’ belong to?", "Design."],
        ["Which stage does ‘finding out what users need’ belong to?", "Analysis."],
        ["Apply abstraction to a map app.", "Show roads, place names and routes; leave out details like individual trees and building colours."],
        ["Decompose ‘a school login system’.", "Input username and password, check against stored data, grant or deny access, log the attempt."],
        ["Why test during coding and not only at the end?", "Errors are easier to find in small pieces of code."],
        ["Identify the inputs and outputs of a digital thermostat.", "Inputs: temperature reading, set temperature. Outputs: heating on/off, display."],
        ["Why does poor analysis cause problems later?", "The program might solve the wrong problem and need to be rebuilt."],
        ["Why is test data chosen before coding?", "So the tests are based on what the program should do, not what the code happens to do."]
      ],
      "subsystems": [
        ["Why is decomposing a large system into sub-systems useful for a team?", "Different programmers can work on different parts at the same time, and each part is easier to test and fix."],
        ["Draw in words a structure diagram for an online shop.", "Top: Online shop. Below: Browse products, Basket, Checkout, Accounts. Under Checkout: Enter address, Payment, Confirm order."],
        ["What is wrong with a structure diagram where a box connects to a box two levels below?", "Lines should only join a box to the boxes directly beneath it — each level breaks down the one above."],
        ["Why might a sub-system be reused in another program?", "It was designed and tested separately, so a part like ‘login’ can work in other systems too."],
        ["Decompose a ‘calculator app’ into sub-systems.", "Input numbers, choose operation, calculate result, display result."],
        ["Why is a large structure diagram easier to maintain?", "Each part can be changed separately without affecting the others."],
        ["Why does each box in a structure diagram connect only to its parent?", "It is part of that sub-system; the diagram shows a strict hierarchy."],
        ["How does decomposition help testing?", "Each sub-system can be tested separately before joining them."],
        ["Give two sub-systems of a library system.", "e.g. Manage loans and manage members (also search books, send reminders)."],
        ["Why might two programmers use the same ‘validate input’ sub-system?", "It saves time and keeps behaviour consistent."],
        ["Decompose ‘a car park barrier system’.", "Detect car, issue ticket, take payment, raise barrier, count spaces."]
      ],
      "algorithms": [
        ["Trace: Total ← 0; FOR i ← 1 TO 4: Total ← Total + i; NEXT; OUTPUT Total.", "Total takes 1, 3, 6, 10 — output 10."],
        ["What does this do? Count ← 0; FOR each mark: IF mark ≥ 50 THEN Count ← Count + 1; OUTPUT Count.", "It counts how many marks are 50 or more (the number of passes)."],
        ["Why use pseudocode rather than a real language at the design stage?", "It focuses on the logic without worrying about the exact syntax of one language, and any programmer can read it."],
        ["X ← 5; WHILE X > 0: X ← X − 2; OUTPUT X. Trace the outputs.", "3, 1, −1 (the loop stops when X is −1)."],
        ["Why is a trace table useful for finding a logic error?", "It shows each variable's value at each step, so you can see exactly where a value differs from what you expected."],
        ["Trace: X ← 3; Y ← X * 2; X ← Y + 1. What are X and Y?", "Y = 6, X = 7."],
        ["Trace: Count ← 0; FOR i ← 1 TO 5: IF i MOD 2 = 0 THEN Count ← Count + 1; NEXT. Final Count?", "2 (i = 2 and 4)."],
        ["What does this do? REPEAT INPUT N UNTIL N > 0.", "Keeps asking for a number until a positive one is entered."],
        ["Why does a flowchart for a loop need a decision diamond?", "To decide whether to repeat the loop or continue."],
        ["Trace: A ← 1; WHILE A < 20: A ← A * 3; ENDWHILE; OUTPUT A.", "A becomes 3, 9, 27; outputs 27."],
        ["Write pseudocode to output the larger of A and B.", "IF A > B THEN OUTPUT A ELSE OUTPUT B ENDIF."],
        ["Why might an algorithm never end?", "Its loop condition is never met, giving an infinite loop."],
        ["Trace: N ← 10; REPEAT N ← N DIV 2 UNTIL N < 2; OUTPUT N.", "N goes 5, 2, 1; outputs 1."]
      ],
      "standard": [
        ["Bubble sort [5, 2, 4, 1]: show the list after the first pass.", "Compare and swap neighbours: [2, 5, 4, 1] → [2, 4, 5, 1] → [2, 4, 1, 5]. The 5 is now in place."],
        ["Why does a linear search work on an unsorted list?", "It checks every item in turn, so order doesn't matter."],
        ["In the worst case, how many comparisons does a linear search of 1000 items need?", "1000 — when the item is last or not there at all."],
        ["Why must Total be set to 0 before a totalling loop and not inside it?", "Inside the loop it would reset every pass, so only the last value would remain."],
        ["Why start Max with the first item rather than 0?", "If all values were negative, starting at 0 would wrongly give 0 as the maximum."],
        ["How many passes does a bubble sort need at most for n items, and when can it stop early?", "n − 1 passes; it can stop early after any pass with no swaps."],
        ["Bubble sort [3, 1, 2]: show each pass.", "Pass 1: [1, 2, 3]. Pass 2: no swaps, so stop."],
        ["Why does Min ← 0 give the wrong minimum for [5, 8, 3]?", "0 is smaller than every item, so it would never be replaced."],
        ["Search [4, 7, 9, 2] for 9. How many comparisons?", "3."],
        ["How do you find the average once you have the total?", "Divide the total by the number of items."],
        ["Swap A and B using a temporary variable.", "Temp ← A; A ← B; B ← Temp."],
        ["Why is a bubble sort slow for large lists?", "It compares many pairs on every pass; the work grows very quickly with list size."],
        ["Why does a search algorithm need a ‘Found’ flag?", "To stop searching once the item is found and report whether it was found."],
        ["Find the average of 4, 8 and 9 using the totalling method.", "Total = 21; average = 21 ÷ 3 = 7."]
      ],
      "validation": [
        ["A date of birth field accepts 30/02/2010. Which check failed to catch it, and what kind of error is it?", "A format check alone passes it; it needs a range/validity check (February has no 30th) — the data is unreasonable."],
        ["A user types their age as 41 instead of 14. Would validation catch it?", "No — 41 is within a sensible range. Only verification (e.g. a visual check) might catch it."],
        ["Choose test data for a field accepting whole numbers 1–10.", "Normal: 5. Extreme: 1, 10. Boundary: 0/1, 10/11. Abnormal: 'ten', 3.5, −4."],
        ["Why is double entry used for new passwords?", "The user can't see the password, so typing it twice checks it was entered as intended."],
        ["Which check makes sure a postcode follows the pattern LL99 9LL?", "A format check."],
        ["Why does a length check suit a phone number field?", "Phone numbers have a known number of digits, so too few or too many must be a mistake."],
        ["Which check stops someone leaving the email field blank?", "A presence check."],
        ["Which check stops a user typing ‘abc’ for their age?", "A type check."],
        ["Give abnormal test data for a field accepting 1–10.", "e.g. 15, −3 or ‘ten’."],
        ["Why is validation done automatically but verification often by the user?", "Validation checks rules a computer can test; verification checks data matches what was intended."],
        ["Why use both validation and verification?", "Validation checks data is reasonable; verification checks it was copied correctly."],
        ["For an age 16–18, give the boundary test data.", "15 and 16, 18 and 19 — the values either side of each limit."],
        ["Why can validation not prove data is correct?", "It only checks data is sensible, not that it is true."]
      ],
      "errors": [
        ["Total ← 0; FOR i ← 1 TO 10: Total ← i; NEXT. What error, and how do you fix it?", "Logic error: Total is overwritten. Fix: Total ← Total + i."],
        ["A loop FOR i ← 0 TO 10 is meant to run 10 times. What's wrong?", "It runs 11 times (0 to 10 inclusive) — use 1 TO 10 or 0 TO 9."],
        ["IF Mark > 50 THEN OUTPUT \"Pass\" — the pass mark is 50. What's wrong?", "A mark of exactly 50 fails; use Mark >= 50."],
        ["Why doesn't a logic error stop a program running?", "The code is valid syntax, so it runs — it just follows the wrong steps and gives incorrect results."],
        ["PRINT(\"Hello\" — what type of error is this?", "Syntax error: the closing bracket is missing, so the translator can't understand it."],
        ["Count ← 0; FOR i ← 1 TO 5: Count ← Count + 1; NEXT; OUTPUT i. What's wrong if we want the count?", "It outputs i instead of Count."],
        ["Average ← Total / 0. What type of error?", "A run-time error — division by zero."],
        ["WHILE X > 0: OUTPUT X; ENDWHILE. What's wrong?", "X never changes, so the loop runs forever."],
        ["IF Age > 18 THEN OUTPUT \"Adult\" — adults are 18 and over. Fix it.", "Use Age >= 18."],
        ["Why are logic errors harder to find than syntax errors?", "The program runs without crashing, but gives wrong results."],
        ["Total ← Total + Price is inside the loop but Total ← 0 is too. What happens?", "Total resets each time, so only the last price is kept."],
        ["FOR i ← 1 TO 5: OUTPUT Name[i] — the array has 4 elements. What error happens?", "A run-time error — index 5 is out of range."]
      ]
    },

    "cs-programming": {
      "concepts": [
        ["Which loop should check a password until it is correct? Why?", "REPEAT…UNTIL (post-condition): the user must enter the password at least once before it can be checked."],
        ["Why use a constant for VAT rather than typing 0.2 throughout?", "If the rate changes it is updated in one place, and the name makes the code easier to read."],
        ["What does 23 MOD 4 and 23 DIV 4 give?", "MOD: 3 (the remainder). DIV: 5 (the whole number of times 4 goes in)."],
        ["Why is a function better than a procedure for calculating an average?", "A function returns the value, so it can be used directly in an expression, e.g. OUTPUT Average(List)."],
        ["Why can using global variables everywhere cause bugs?", "Any part of the program can change them, so an unexpected change in one subroutine can break another."],
        ["SUBSTRING(\"COMPUTER\", 1, 4) returns what?", "\"COMP\" — 4 characters starting at position 1."],
        ["Choose a data type for each: a price, a person's age, whether they're a member, a postcode.", "Price: real. Age: integer. Member: Boolean. Postcode: string."],
        ["What does 17 MOD 5 give? 17 DIV 5?", "2 and 3."],
        ["How can MOD test whether a number is even?", "If N MOD 2 = 0, it is even."],
        ["Choose a loop to output the times table of 7 from 1 to 12.", "A FOR loop — the number of repeats is known."],
        ["What does SUBSTRING(\"PYTHON\", 3, 2) return?", "\"TH\" — 2 characters from position 3."],
        ["Why does a function return a value?", "So the result can be used in the rest of the program, e.g. assigned or output."],
        ["Why is a local variable safer?", "It only exists inside its subroutine, so other parts can't change it by mistake."],
        ["Why use meaningful identifiers?", "Code is easier to read, understand and maintain."],
        ["Why add comments to code?", "To explain what each part does to other programmers (or yourself later)."],
        ["What does RANDOM() return in pseudocode?", "A random real number between 0 and 1."],
        ["Why use a procedure for printing a menu used in several places?", "Code is written once, so it's shorter and easier to change."]
      ],
      "arrays": [
        ["Why use an array to store 30 test scores instead of 30 variables?", "One identifier with an index makes it possible to process every score with a loop, and the code is shorter and easier to maintain."],
        ["Write pseudocode to output every element of Scores[1:10].", "FOR i ← 1 TO 10\n  OUTPUT Scores[i]\nNEXT i"],
        ["A 2D array Seats[1:5, 1:8] stores cinema seats. How many seats, and what does Seats[2,3] mean?", "5 × 8 = 40 seats; Seats[2,3] is row 2, seat (column) 3."],
        ["Why does processing a 2D array need nested loops?", "The outer loop moves through each row; for each row the inner loop moves through every column."],
        ["What goes wrong if you access Scores[11] in an array declared [1:10]?", "The index is out of range — a run-time error, because element 11 doesn't exist."],
        ["Write pseudocode to total all elements of Marks[1:20].", "Total ← 0; FOR i ← 1 TO 20: Total ← Total + Marks[i]; NEXT i."],
        ["Write pseudocode to find the largest value in Temps[1:7].", "Max ← Temps[1]; FOR i ← 2 TO 7: IF Temps[i] > Max THEN Max ← Temps[i]; NEXT i."],
        ["A 2D array stores marks for 30 students in 5 subjects. How many elements?", "30 × 5 = 150."],
        ["Write pseudocode to set every element of Grid[1:3, 1:3] to 0.", "FOR r ← 1 TO 3: FOR c ← 1 TO 3: Grid[r, c] ← 0; NEXT c; NEXT r."],
        ["Why do arrays make searching easier?", "A loop can check each element by its index."],
        ["Why might you use a 2D array for a game board?", "Rows and columns match the grid of the board."],
        ["Write pseudocode to count how many elements of Scores[1:30] are above 50.", "Count ← 0; FOR i ← 1 TO 30: IF Scores[i] > 50 THEN Count ← Count + 1; NEXT i."]
      ],
      "files": [
        ["Why would a high-score table be saved in a file and not just a variable?", "Variables are in RAM and lost when the program closes; a file keeps the scores for next time."],
        ["A program opens a file in WRITE mode to add a new score. What goes wrong?", "WRITE creates a new file, erasing the old scores — use APPEND."],
        ["Write pseudocode to read every line of a file and output it.", "OPENFILE \"data.txt\" FOR READ\nWHILE NOT EOF(\"data.txt\")\n  READFILE \"data.txt\", Line\n  OUTPUT Line\nENDWHILE\nCLOSEFILE \"data.txt\""],
        ["Why should a file be closed after use?", "So the data is properly saved and the file is released for other programs to use."],
        ["Why use APPEND mode to add a new line to a log?", "It adds to the end without deleting existing data."],
        ["Why does a loop reading a file check EOF?", "To stop at the end and avoid reading past the last line."],
        ["Write pseudocode to save the name ‘Ada’ to Names.txt.", "OPENFILE \"Names.txt\" FOR WRITE; WRITEFILE \"Names.txt\", \"Ada\"; CLOSEFILE \"Names.txt\"."],
        ["Why might a program crash when reading a file?", "The file doesn't exist, is in use, or the path is wrong."],
        ["How could you count the lines in a file?", "Read each line in a loop until EOF, adding 1 to a counter each time."],
        ["Why store settings in a file?", "So user preferences are kept the next time the program runs."],
        ["Why read a file in a loop instead of reading one line?", "The number of lines may not be known in advance."]
      ]
    },

    "cs-databases": {
      "database": [
        ["Why is a student name not a good primary key?", "Two students could have the same name; a primary key must be unique for every record."],
        ["A table has 6 columns and 21 rows including the header. How many fields and records?", "6 fields and 20 records."],
        ["Choose data types for: StudentID ‘S0042’, DateOfBirth, Fee £12.50, Paid?", "StudentID: text; DateOfBirth: date/time; Fee: real (currency); Paid: Boolean."],
        ["Why is storing data in a database better than in separate paper files?", "It can be searched, sorted and updated quickly and accurately, and data is stored once in a consistent structure."],
        ["Suggest a validation check for a ‘Year group’ field (7–13).", "A range check: accept only integers from 7 to 13."],
        ["Choose a primary key for a table of library books.", "ISBN or a unique BookID."],
        ["Why store Age as a date of birth instead?", "Age changes every year; date of birth stays the same and age can be calculated."],
        ["What data type suits a price like 4.99?", "Real (or currency)."],
        ["Why does a database need a primary key?", "To identify each record uniquely, so the right one is found or updated."],
        ["Suggest a validation check for an email field.", "A format check (contains @ and a dot) and a presence check."],
        ["Why might two records have the same name but different IDs?", "Two different people can share a name; the ID tells them apart."],
        ["Why should a field like Surname be text rather than character?", "A surname has several characters; character holds only one."]
      ],
      "sql": [
        ["Write SQL to count the members who live in 'Paris'.", "SELECT COUNT(*) FROM Members WHERE City = 'Paris';"],
        ["Write SQL to show the total of the Price field for items in category 'Toys'.", "SELECT SUM(Price) FROM Items WHERE Category = 'Toys';"],
        ["What does this return? SELECT Name FROM Pupils WHERE Age > 14 AND House = 'Red' ORDER BY Name DESC;", "The names of pupils older than 14 who are in Red house, in reverse alphabetical order."],
        ["Fix: SELECT Name Age FROM Students WHERE Town = Leeds", "SELECT Name, Age FROM Students WHERE Town = 'Leeds'; — comma between fields, quotes around text."],
        ["What's the difference between WHERE A = 1 AND B = 2 and WHERE A = 1 OR B = 2?", "AND returns records meeting both conditions (fewer); OR returns records meeting either (more)."],
        ["Write SQL to show the Title of books costing less than 10, sorted by Title.", "SELECT Title FROM Books WHERE Price < 10 ORDER BY Title;"],
        ["Write SQL to show Name of members who are not in Year 11.", "SELECT Name FROM Members WHERE Year <> 11;"],
        ["Why are numbers not in quotes in a WHERE clause?", "Quotes mark text; numbers are compared as numeric values."],
        ["Write SQL to show Name and Score of players with Score of at least 50.", "SELECT Name, Score FROM Players WHERE Score >= 50;"],
        ["Fix: SELECT Name FROM Students ORDER Age;", "SELECT Name FROM Students ORDER BY Age;"],
        ["Write SQL to count how many Products have Stock = 0.", "SELECT COUNT(*) FROM Products WHERE Stock = 0;"],
        ["Write SQL to show the Name of pupils in House 'Blue' or 'Green'.", "SELECT Name FROM Pupils WHERE House = 'Blue' OR House = 'Green';"]
      ]
    },

    "cs-boolean-logic": {
      "gates": [
        ["Why is NAND called a universal gate?", "Any other gate (NOT, AND, OR…) can be built from NAND gates alone."],
        ["What is the output of NOT (1 AND 0)?", "1 AND 0 = 0, NOT 0 = 1."],
        ["When do XOR and OR give different outputs?", "Only when both inputs are 1: OR gives 1, XOR gives 0."],
        ["A safety system: the machine runs only if the guard is closed (A = 1) and the start button is pressed (B = 1). Which gate?", "AND — both conditions must be true."],
        ["How many rows in a truth table with 4 inputs?", "2⁴ = 16."],
        ["An alarm sounds when either of two sensors detects movement. Which gate?", "OR."],
        ["What is 1 NOR 0?", "0 — OR gives 1, then NOT gives 0."],
        ["What is 1 XOR 1?", "0 — the inputs are the same."],
        ["What is NOT(0 OR 0)?", "1."],
        ["When do NAND and AND give different outputs?", "Always — NAND is the opposite of AND for every input."],
        ["A light is on unless both switches are on. Which gate?", "NAND."],
        ["A light is on only when neither switch is on. Which gate?", "NOR."],
        ["Why does adding one input double the rows in a truth table?", "Each new input can be 0 or 1 for every existing combination."],
        ["What is 0 NAND 0?", "1 — AND gives 0, then NOT gives 1."]
      ],
      "tables": [
        ["Complete X = NOT(A OR B) for A,B = 00, 01, 10, 11.", "A OR B: 0,1,1,1 → X: 1,0,0,0 (a NOR gate)."],
        ["Write the expression for a truth table where X = 1 only for A=1, B=0.", "X = A AND (NOT B)."],
        ["X = (A AND B) OR (NOT C). Find X for A=0, B=1, C=1.", "A AND B = 0; NOT C = 0; X = 0 OR 0 = 0."],
        ["Why add working columns for each gate's output?", "It breaks the circuit into simple steps, so mistakes are easier to avoid and spot."],
        ["A truth table has X = 1 on rows 011 and 101 (A,B,C). Write an expression.", "X = (NOT A AND B AND C) OR (A AND NOT B AND C)."],
        ["Find X = A AND (B OR C) for A=1, B=0, C=1.", "B OR C = 1; 1 AND 1 = 1."],
        ["Find X = NOT A OR B for A=1, B=0.", "NOT A = 0; 0 OR 0 = 0."],
        ["Complete X = A XOR B for A,B = 00, 01, 10, 11.", "0, 1, 1, 0."],
        ["Write the expression for X = 1 only when A=0 and B=0.", "X = NOT A AND NOT B (= NOT (A OR B))."],
        ["Complete X = (A AND B) OR C for 110.", "A AND B = 1; 1 OR 0 = 1."],
        ["Why does working column by column reduce mistakes?", "Each gate's output is worked out separately before combining them."],
        ["Find X = NOT (A AND B) OR C for A=1, B=1, C=0.", "A AND B = 1; NOT = 0; 0 OR 0 = 0."]
      ],
      "circuits": [
        ["Write the expression: ‘The light comes on if it is dark (A) and motion is detected (B), or the manual switch is on (C).’", "X = (A AND B) OR C."],
        ["Write the expression: ‘The fan runs if the temperature is high (T) and the window is NOT open (W).’", "X = T AND (NOT W)."],
        ["Describe the gates needed for X = (A OR B) AND (NOT C).", "An OR gate with inputs A and B; a NOT gate on C; both outputs feed an AND gate giving X."],
        ["Translate: ‘The buzzer sounds if exactly one of the two doors is open.’", "X = A XOR B."],
        ["Why should you check a drawn circuit with a truth table?", "To confirm every input combination gives the output the problem describes, catching wiring or logic mistakes."],
        ["Write the expression: ‘The pump runs if the tank is low (L) AND the power is on (P), but NOT if the override (O) is on.’", "X = (L AND P) AND NOT O."],
        ["Write the expression: ‘The door unlocks if the code is correct (C) OR the key is used (K).’", "X = C OR K."],
        ["Describe the circuit for X = NOT (A AND B) OR C.", "A and B into a NAND gate; its output and C go into an OR gate."],
        ["Write the expression: ‘The warning light shows if the seatbelt is NOT fastened (S) AND the engine is on (E).’", "X = NOT S AND E."],
        ["How many rows are needed to check a circuit with inputs A, B and C?", "8."],
        ["Why draw the circuit from the inputs towards the output?", "Gates nearest the inputs are worked out first, following the brackets."],
        ["Write the expression: ‘The kettle heats if it has water (W) AND is switched on (S) AND is NOT boiling (B).’", "X = W AND S AND NOT B."]
      ]
    }
  });
})();
