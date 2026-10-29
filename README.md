# VaultCode — Vault-Cracking Protocol

[![.NET 8.0](https://img.shields.io/badge/.NET-8.0-512bd4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![Blazor WebAssembly](https://img.shields.io/badge/Blazor-WebAssembly-512bd4?style=flat-square&logo=blazor)](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x_CDN-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-6.5-10b981?style=flat-square&logo=font-awesome)](https://fontawesome.com/)
[![Build Status](https://img.shields.io/badge/Build-0_Errors_0_Warnings-emerald?style=flat-square)]()
[![Theme](https://img.shields.io/badge/Theme-Dark_Glassmorphism-8b5cf6?style=flat-square)]()

**VaultCode** is a high-stakes, singleplayer vault-cracking code breaker minigame developed with **Blazor WebAssembly (.NET 8.0)** and styled using an immersive **dark glassmorphism** aesthetic powered by Tailwind CSS.

Infiltrate Neo-Veridia Megabank's encrypted cold storage mainframe. Deduce the randomly generated biometric cipher using quantum feedback analysis before security countermeasures trigger complete lockout.

---

## Decryption Rules & How Features Work

### 1. Step-by-Step Game Loop
1. **Choose Clearance Level**:
   - **Operative Tier**: 4-digit code sequence (Casual penetration).
   - **Mastermind Tier**: 5-digit code sequence (Strict permadeath challenge).
2. **Input Passcode**:
   - Enter digits (0–9) using the **On-Screen Glass Keypad** or your **Physical Keyboard** (`0-9`, `Backspace`, `Enter`).
3. **Execute Breach**:
   - Press **`↵ EXEC`** or hit **Enter** to submit your code attempt.
4. **Spectral Feedback Evaluation**:
   - The vault matrix evaluates your guess against the secret passcode in two algorithmic passes (exact positional match first, followed by misplaced frequency matches).
5. **Win / Lockout Conditions**:
   - **ACCESS GRANTED**: Match all digits in their exact slots before running out of attempts or time.
   - **LOCKOUT**: Exhaust 6 attempts or allow the countdown timer to reach zero. The secret passcode is then revealed.

---

### 2. Spectral Feedback Color Codes

| State | Status Token | Class Styling | Description |
|---|---|---|---|
| 🟢 **Correct** | `DigitStatus.Correct` | `bg-emerald-500/20 text-emerald-300 border-emerald-500/40` | Digit exists in passcode and is in the **exact correct position**. |
| 🟡 **Misplaced** | `DigitStatus.Misplaced` | `bg-amber-500/20 text-amber-300 border-amber-500/40` | Digit exists in passcode, but belongs in a **different slot**. |
| ⚪ **Wrong** | `DigitStatus.Wrong` | `bg-white/5 text-white/30 border-white/10` | Digit is **not present** anywhere in the secret passcode. |

---

## The 4 Implemented Screens

1. **Screen 1 — Home / Landing Page (`/`)**:
   - Cyber-heist hero section with dynamic glitch badges, animated vault card preview, and floating security clearance badges.
   - 3-column gameplay mechanics guide explaining the spectral feedback matrix.
   - "Why breach the Vault?" lore narrative set in Neo-Veridia 2099.
   - Call-to-action banner linking directly to the terminal.

2. **Screen 2 — Login Page (`/login`)**:
   - Security clearance selector tabs (Operative vs. Mastermind mode).
   - Codename authentication and passkey input with glassmorphic styling and validation.
   - Simulated terminal handshake state showing biometric cipher synchronization.
   - One-click Guest Mode bypass.

3. **Screen 3 — Signup Page (`/signup`)**:
   - Infiltrator agent registration capturing First Name, Last Name, Codename, and Email.
   - Interactive 5-avatar primary decryption tool selector (Ninja, Ghost, Synth, Hacker, Cipher).
   - Target security clearance level selection and password confirmation validation.

4. **Screen 4 — Vault Terminal Dashboard (`/terminal`)**:
   - **Interactive Vault Matrix**: 6-row glass code grid displaying evaluated color-coded tiles and live typing feedback.
   - **On-Screen Glass Keypad**: Numbers 0–9, Delete (`⌫`), and Execute (`↵ EXEC`) buttons with tactile click responses.
   - **Breach Status Bar**: Live attempt counter (`#(N) / 6`), visual cycle progress pips, and live countdown timer.
   - **Agent Dossier & Heists Card**: Confirmed breaches counter, win streak counter, success rate percentage, and recent heists activity feed.
   - **Reboot / New Vault**: Instantly regenerates a fresh encrypted passcode in C#.
   - **Game Over Modal**: Victory access or security lockout overlay with full passcode reveal and instant re-match trigger.

---

## OOP Domain Models Reference Table

All domain models reside cleanly under the `VaultCode.Models` namespace in the `Models/` folder:

| Model / Class | OOP Construct | Hierarchy | Primary Responsibilities & Attributes |
|---|---|---|---|
| `IVaultGame` | Interface | Interface Contract | Defines the abstraction contract for codebreaker vaults (`CodeLength`, `ClearanceLevel`, `MaxAttempts`, `Attempts`, `IsSolved`, `IsGameOver`, `RevealedCode`, `SubmitGuess`). |
| `User` | Abstract Base Class | `object` &rarr; `User` | Base entity defining `Id`, `FirstName`, `LastName`, `Email`, `Role`, and computed properties `FullName` and `Initials`. |
| `HackerAgent` | Concrete Subclass | `User` &rarr; `HackerAgent` | Inherits from `User`. Adds `Codename`, `ClearanceLevel`, `TotalBreaches`, `WinStreak`, `TotalAttempts`, `AvatarIcon`, `BestScore`, `FewestAttempts`, `ClearanceRank`, `RankIcon`, `RankBadgeColor`, and `NextRankRequirement`. |
| `VaultGame` | Encapsulated Entity | `IVaultGame` &rarr; `VaultGame` | Implements `IVaultGame`. Encapsulates `_secretCode` (private string). Evaluates two-pass guess deduction logic via `SubmitGuess(string)`. |
| `CodeAttempt` | Entity Class | `object` &rarr; `CodeAttempt` | Encapsulates a submitted guess (`GuessString`), evaluated results (`List<DigitStatus>`), and a `Timestamp`. |
| `ClearanceLevel` | Enum | `System.Enum` | Defines clearance tiers: `Operative` (4-digit code // 45s) and `Mastermind` (5-digit code // 30s Hard). |
| `DigitStatus` | Enum | `System.Enum` | Defines evaluation tokens: `Correct` (Emerald), `Misplaced` (Amber), and `Wrong` (Slate/Muted). |

---

## Quickstart Local Running Guide

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or higher.
- Modern web browser (Chrome, Edge, Firefox, Brave).

### 1. Restore Dependencies
```bash
dotnet restore
```

### 2. Build the Project
Verify that the project builds cleanly with **0 errors and 0 warnings**:
```bash
dotnet build
```

### 3. Launch Development Server
Run the Blazor WebAssembly standalone server:
```bash
dotnet run
```
Open your browser and navigate to the local hosting address displayed in the terminal (typically `http://localhost:5000` or `https://localhost:5001`).

### 4. Hot Reload Mode (Optional)
To test UI or code changes with automatic re-compilation:
```bash
dotnet watch
```

---

## Visual & Design System Specifications
- **Background**: Deep obsidian-to-navy gradient (`#060814` to `#0c1428`) with micro dot-grid overlay (`.cyber-grid`) and glowing radial ambient orbs (`.cyber-orb-cyan`, `.cyber-orb-violet`).
- **Glass Surfaces**: Dark frosted acrylic cards (`rgba(15, 23, 42, 0.58)`, `backdrop-blur-md`, `border: 1px solid rgba(255, 255, 255, 0.12)`, `rounded-2xl`).
- **Typography**: `DM Sans` for display headers and `Inter` for body readability. Monospace font for digital readouts.
- **Interactivity**: `.card-lift` hover physics, `.anim-fade-up`, `.anim-float`, and `.anim-glow` CSS keyframes.
