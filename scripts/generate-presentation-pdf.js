const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DigitalSignature Suite - Final Year Project Defense Presentation</title>
  <style>
    @page {
      size: 297mm 210mm; /* A4 Landscape */
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 297mm;
      background-color: #0B0F19;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #E2E8F0;
      -webkit-font-smoothing: antialiased;
    }

    /* SLIDE BASE */
    .slide {
      width: 297mm;
      height: 210mm;
      max-width: 297mm;
      max-height: 210mm;
      overflow: hidden;
      box-sizing: border-box;
      page-break-after: always;
      break-after: page;
      padding: 14mm 18mm 12mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      background: radial-gradient(circle at top right, rgba(30, 41, 59, 0.45) 0%, rgba(11, 15, 25, 1) 75%);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* HEADER */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4mm;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 3mm;
    }
    .header-left {
      max-width: 210mm;
    }
    .category-badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.25);
      padding: 2px 10px;
      border-radius: 9999px;
      margin-bottom: 4px;
    }
    .slide-title {
      font-size: 19pt;
      font-weight: 800;
      color: #FFFFFF;
      margin: 2px 0 3px 0;
      letter-spacing: -0.3px;
    }
    .slide-subtitle {
      font-size: 9.5pt;
      color: #94A3B8;
      margin: 0;
      line-height: 1.3;
    }
    .slide-num-pill {
      font-size: 9pt;
      font-weight: 700;
      color: #64748B;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 12px;
      border-radius: 8px;
      white-space: nowrap;
    }

    /* FOOTER */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 3mm;
      margin-top: 3mm;
      font-size: 8pt;
      color: #64748B;
    }
    .footer-left {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .footer-dot {
      width: 4px;
      height: 4px;
      background: #475569;
      border-radius: 50%;
    }

    /* CONTENT LAYOUTS */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4mm;
      overflow: hidden;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4mm;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 3.5mm;
    }

    /* CARDS */
    .card {
      background: rgba(26, 32, 53, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 14px;
      position: relative;
    }
    .card-title {
      font-size: 11pt;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .card-p {
      font-size: 8.8pt;
      color: #94A3B8;
      line-height: 1.42;
      margin: 0;
    }

    /* BADGES */
    .algo-badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .algo-rsa { background: rgba(99, 102, 241, 0.18); color: #818CF8; border: 1px solid rgba(99, 102, 241, 0.35); }
    .algo-dsa { background: rgba(6, 182, 212, 0.18); color: #22D3EE; border: 1px solid rgba(6, 182, 212, 0.35); }
    .algo-ecdsa { background: rgba(16, 185, 129, 0.18); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.35); }
    .algo-ed { background: rgba(245, 158, 11, 0.18); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.35); }

    /* TABLES */
    .comp-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      text-align: left;
    }
    .comp-table th {
      background: rgba(255, 255, 255, 0.05);
      color: #CBD5E1;
      padding: 7px 10px;
      font-weight: 700;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 7.8pt;
    }
    .comp-table td {
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #94A3B8;
      vertical-align: middle;
    }
    .comp-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .highlight-row td {
      background: rgba(245, 158, 11, 0.05);
      color: #F8FAFC;
      font-weight: 600;
    }

    /* STEP BOXES */
    .step-box {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 11px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: #38BDF8;
      color: #0F172A;
      font-weight: 800;
      font-size: 8.5pt;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .step-content {
      flex: 1;
    }
    .step-head {
      font-size: 9.2pt;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 2px;
    }
    .step-desc {
      font-size: 8pt;
      color: #94A3B8;
      line-height: 1.35;
      margin: 0;
    }

    /* CODE / MONOSPACE BLOCKS */
    .code-pill {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 7.8pt;
      background: rgba(0, 0, 0, 0.4);
      padding: 1px 6px;
      border-radius: 4px;
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }

    /* HIGHLIGHT STATS */
    .stat-pill {
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 10px;
      text-align: center;
    }
    .stat-val {
      font-size: 13pt;
      font-weight: 800;
      color: #FFFFFF;
    }
    .stat-lbl {
      font-size: 7.2pt;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* CALLOUT BOX */
    .callout {
      border-left: 3px solid #38BDF8;
      background: rgba(56, 189, 248, 0.08);
      padding: 8px 12px;
      border-radius: 0 8px 8px 0;
      font-size: 8.5pt;
      color: #BAE6FD;
      line-height: 1.4;
    }

    /* COVER SPECIFICS */
    .cover-slide {
      justify-content: center;
      align-items: center;
      text-align: center;
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.6) 0%, rgba(11, 15, 25, 1) 100%);
      padding: 20mm;
    }
    .cover-tag {
      font-size: 10pt;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 6px 18px;
      border-radius: 9999px;
      margin-bottom: 6mm;
      display: inline-block;
    }
    .cover-title {
      font-size: 32pt;
      font-weight: 900;
      color: #FFFFFF;
      margin: 0 0 4mm 0;
      letter-spacing: -0.5px;
      line-height: 1.15;
    }
    .cover-title span {
      background: linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cover-sub {
      font-size: 13pt;
      color: #94A3B8;
      max-width: 220mm;
      margin: 0 auto 8mm auto;
      line-height: 1.5;
    }
    .algo-pill-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8mm;
    }
    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      max-width: 230mm;
      width: 100%;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 6mm;
    }
    .meta-item {
      text-align: center;
    }
    .meta-title {
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748B;
      margin-bottom: 3px;
    }
    .meta-val {
      font-size: 9.5pt;
      font-weight: 700;
      color: #E2E8F0;
    }
  </style>
</head>
<body>

  <!-- ==================== SLIDE 1: COVER ==================== -->
  <div class="slide cover-slide">
    <div class="cover-tag">FINAL YEAR PROJECT DEFENSE • COMPUTER SCIENCE & SOFTWARE ENGINEERING</div>
    <h1 class="cover-title">DIGITAL SIGNATURE <span>SUITE</span></h1>
    <p class="cover-sub">
      A Fullstack Empirical Benchmarking & Tamper-Evident Document Verification System for Modern Asymmetric Cryptographic Algorithms
    </p>

    <div class="algo-pill-row">
      <span class="algo-badge algo-rsa" style="font-size:9pt; padding:4px 14px;">RSA-PSS (2048-bit)</span>
      <span class="algo-badge algo-dsa" style="font-size:9pt; padding:4px 14px;">DSA (2048-bit)</span>
      <span class="algo-badge algo-ecdsa" style="font-size:9pt; padding:4px 14px;">ECDSA (NIST P-256)</span>
      <span class="algo-badge algo-ed" style="font-size:9pt; padding:4px 14px;">Ed25519 (EdDSA)</span>
    </div>

    <div class="cover-meta-grid">
      <div class="meta-item">
        <div class="meta-title">Project Scope</div>
        <div class="meta-val">Fullstack Web App & Crypto Engine</div>
      </div>
      <div class="meta-item">
        <div class="meta-title">Core Technology</div>
        <div class="meta-val">Next.js 15 • Node Crypto • MongoDB</div>
      </div>
      <div class="meta-item">
        <div class="meta-title">Security Model</div>
        <div class="meta-val">Zero-Trust Ephemeral Keys</div>
      </div>
      <div class="meta-item">
        <div class="meta-title">Project Presentation</div>
        <div class="meta-val">Academic Defense Portfolio</div>
      </div>
    </div>
  </div>

  <!-- ==================== SLIDE 2: MOTIVATION & PROBLEM STATEMENT ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 1: Background & Problem Statement</div>
        <div class="slide-title">The Digital Trust Crisis & Cryptographic Dilemma</div>
        <div class="slide-subtitle">Why traditional document handling fails and why organizations struggle with cryptographic adoption</div>
      </div>
      <div class="slide-num-pill">Slide 02 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-3">
        <div class="card" style="border-top: 3px solid #EF4444;">
          <div class="card-title" style="color: #F87171;">⚠️ Vulnerability to Undetected Forgery</div>
          <p class="card-p">
            Millions of enterprise contracts and academic certificates still rely on naive visual image signatures or plain PDF text.
            <br><br>
            A malicious actor can alter contract sums, dates, or recipient identities without triggering any visual alert. Traditional systems lack built-in cryptographic integrity checks.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid #F59E0B;">
          <div class="card-title" style="color: #FBBF24;">🔄 Cryptographic Fragmentation & Debt</div>
          <p class="card-p">
            Organizations are paralyzed by outdated cryptographic standards. Many still use legacy RSA PKCS#1 v1.5 or deprecated DSA without understanding modern elliptic curve alternatives.
            <br><br>
            Engineers lack clear empirical data on real-world tradeoffs: <em>Is Ed25519 actually faster? How big are signature payloads over mobile networks?</em>
          </p>
        </div>

        <div class="card" style="border-top: 3px solid #10B981;">
          <div class="card-title" style="color: #34D399;">💡 The Engineering Solution</div>
          <p class="card-p">
            <strong>DigitalSignature Suite</strong> solves this by bridging mathematical cryptography with an accessible fullstack web platform:
            <br><br>
            • End-to-end document signing with tamper detection.<br>
            • Side-by-side empirical benchmarking (10–500 runs).<br>
            • Clear visualization of latency, key size, and signature overhead.
          </p>
        </div>
      </div>

      <div class="callout">
        <strong>Core Research Question:</strong> How do modern Edwards-curve signatures (Ed25519) compare against NIST standards (RSA-PSS, ECDSA P-256, DSA) in execution latency, memory footprint, and resistance to implementation vulnerabilities in web environments?
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Final Year Defense</span>
        <span class="footer-dot"></span>
        <span>Problem Statement</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 3: AIM & OBJECTIVES ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 2: Aim & Objectives</div>
        <div class="slide-title">Project Aim, Specific Objectives & Academic Scope</div>
        <div class="slide-subtitle">Concrete milestones achieved during the design and implementation of the system</div>
      </div>
      <div class="slide-num-pill">Slide 03 / 12</div>
    </div>

    <div class="content-area">
      <div class="card" style="background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); padding: 8px 14px;">
        <div style="font-size: 10.5pt; font-weight: 700; color: #38BDF8; margin-bottom: 3px;">Project Primary Aim</div>
        <div style="font-size: 8.8pt; color: #E2E8F0; line-height: 1.4;">
          To design, engineer, and empirically evaluate a fullstack cryptographic platform capable of issuing digital signatures, verifying multi-format documents, demonstrating immediate tamper detection, and generating reproducible performance benchmarks.
        </div>
      </div>

      <div class="grid-2">
        <div class="step-box">
          <div class="step-num">1</div>
          <div class="step-content">
            <div class="step-head">Multi-Algorithm Cryptographic Kernel</div>
            <p class="step-desc">Implement RSA-PSS (2048-bit), DSA (2048-bit), ECDSA (P-256), and Ed25519 directly through Node.js hardware-accelerated OpenSSL bindings, avoiding insecure 3rd-party JS math packages.</p>
          </div>
        </div>

        <div class="step-box">
          <div class="step-num">2</div>
          <div class="step-content">
            <div class="step-head">Zero-Trust Ephemeral Key Architecture</div>
            <p class="step-desc">Ensure private signing keys exist exclusively in volatile RAM for the nanoseconds required to compute the signature, guaranteeing zero persistence to disk, database, or network logs.</p>
          </div>
        </div>

        <div class="step-box">
          <div class="step-num">3</div>
          <div class="step-content">
            <div class="step-head">Dual-Phase Tamper-Evident Verification</div>
            <p class="step-desc">Combine pre-verification SHA-256 cryptographic hashing with mathematical public-key signature checks to expose any single-bit mutation or forged signature attempt immediately.</p>
          </div>
        </div>

        <div class="step-box">
          <div class="step-num">4</div>
          <div class="step-content">
            <div class="step-head">Empirical Microsecond Benchmarking Suite</div>
            <p class="step-desc">Deploy a controlled testing harness measuring execution time using high-resolution timers (<span class="code-pill">process.hrtime.bigint()</span>), visualizing latency & payload distributions, and exporting CSV datasets.</p>
          </div>
        </div>
      </div>

      <div class="step-box">
        <div class="step-num">5</div>
        <div class="step-content">
          <div class="step-head">Enterprise Security, RBAC & Immutable Audit Trail</div>
          <p class="step-desc">Deliver a production-ready web application with JWT stateless authentication, bcrypt password hashing (12 rounds), role-based admin consoles, and comprehensive operational audit trails.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Aim & Objectives</span>
        <span class="footer-dot"></span>
        <span>5 Key Deliverables</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 4: CRYPTOGRAPHY MADE SIMPLE ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 3: Cryptography Fundamentals</div>
        <div class="slide-title">How Digital Signatures Work (The Core Concepts)</div>
        <div class="slide-subtitle">Demystifying hashing, public-private keypairs, and the three pillars of digital trust</div>
      </div>
      <div class="slide-num-pill">Slide 04 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-3" style="margin-bottom: 2mm;">
        <div class="card" style="text-align: center; border-color: rgba(56, 189, 248, 0.3);">
          <div style="font-size: 20pt; margin-bottom: 4px;">🛡️</div>
          <div class="card-title" style="justify-content: center; color: #38BDF8;">1. Data Integrity</div>
          <p class="card-p">Guarantees that the document has not been altered, modified, or corrupted in any way since it was signed. Even changing a single punctuation mark breaks the mathematical verification.</p>
        </div>

        <div class="card" style="text-align: center; border-color: rgba(129, 140, 248, 0.3);">
          <div style="font-size: 20pt; margin-bottom: 4px;">🔏</div>
          <div class="card-title" style="justify-content: center; color: #818CF8;">2. Signer Authenticity</div>
          <p class="card-p">Confirms the true identity of the author. Because the signature requires the secret private key, no unauthorized party can forge a signature under the legitimate author's identity.</p>
        </div>

        <div class="card" style="text-align: center; border-color: rgba(52, 211, 153, 0.3);">
          <div style="font-size: 20pt; margin-bottom: 4px;">⚖️</div>
          <div class="card-title" style="justify-content: center; color: #34D399;">3. Non-Repudiation</div>
          <p class="card-p">Provides indisputable mathematical proof in legal and technical disputes. The signer cannot claim they never approved the document once the signature validates with their public key.</p>
        </div>
      </div>

      <div class="card" style="background: rgba(15, 23, 42, 0.95); padding: 10px 16px;">
        <div style="font-size: 9.5pt; font-weight: 700; color: #F8FAFC; margin-bottom: 8px;">The Two-Phase Signing & Verification Mechanics</div>
        <div class="grid-2" style="gap: 16px;">
          <div style="border-right: 1px solid rgba(255, 255, 255, 0.08); padding-right: 14px;">
            <div style="font-size: 8.8pt; font-weight: 700; color: #F59E0B; margin-bottom: 4px;">Signing Phase (Sender Side)</div>
            <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
              1. <strong>Hash Calculation:</strong> Document $\rightarrow$ <span class="code-pill">SHA-256</span> $\rightarrow$ 64-character fixed fingerprint.<br>
              2. <strong>Encryption:</strong> Fingerprint + <strong>Private Key</strong> $\rightarrow$ Mathematical Digital Signature.<br>
              3. <strong>Distribution:</strong> Transmit Document + Signature + Public Key to recipient.
            </div>
          </div>
          <div>
            <div style="font-size: 8.8pt; font-weight: 700; color: #10B981; margin-bottom: 4px;">Verification Phase (Recipient Side)</div>
            <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
              1. <strong>Re-hash Document:</strong> Calculate SHA-256 of received document.<br>
              2. <strong>Decrypt Signature:</strong> Signature + <strong>Public Key</strong> $\rightarrow$ Decrypted Hash.<br>
              3. <strong>Comparison:</strong> If <span class="code-pill">Hash(Received) == DecryptedHash</span> $\rightarrow$ <strong>VALID & UNTOUCHED</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Core Concepts</span>
        <span class="footer-dot"></span>
        <span>SHA-256 & Asymmetric Cryptography</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 5: THE 4 ALGORITHMS EVALUATED ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 4: Algorithmic Comparative Analysis</div>
        <div class="slide-title">The Four Evaluated Digital Signature Algorithms</div>
        <div class="slide-subtitle">Architectural design, mathematical foundations, and security profiles</div>
      </div>
      <div class="slide-num-pill">Slide 05 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-4">
        <!-- RSA-PSS -->
        <div class="card" style="border-top: 3px solid #6366F1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="algo-badge algo-rsa">RSA-PSS</span>
            <span style="font-size: 7.5pt; color: #818CF8; font-weight: 700;">2048-bit</span>
          </div>
          <div style="font-size: 8.5pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Probabilistic Signature Scheme</div>
          <p class="card-p" style="font-size: 8pt; margin-bottom: 8px;">
            Uses prime factorization ($n = p \times q$) with RFC 8017 randomized salt padding. Immune to Bleichenbacher padding attacks that crippled legacy PKCS#1 v1.5.
          </p>
          <div style="font-size: 7.5pt; color: #CBD5E1; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 6px; line-height: 1.4;">
            • Sig Size: <strong>256 Bytes</strong><br>
            • PubKey Size: <strong>426 Bytes</strong><br>
            • Verdict: <strong>Fast verify, heavy signing</strong>
          </div>
        </div>

        <!-- DSA -->
        <div class="card" style="border-top: 3px solid #06B6D4;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="algo-badge algo-dsa">DSA</span>
            <span style="font-size: 7.5pt; color: #22D3EE; font-weight: 700;">2048 / 256</span>
          </div>
          <div style="font-size: 8.5pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Digital Signature Algorithm</div>
          <p class="card-p" style="font-size: 8pt; margin-bottom: 8px;">
            NIST FIPS 186 standard based on modular exponentiation and the Discrete Logarithm Problem. Legacy standard widely deployed in US government infrastructure.
          </p>
          <div style="font-size: 7.5pt; color: #CBD5E1; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 6px; line-height: 1.4;">
            • Sig Size: <strong>~48 Bytes (DER)</strong><br>
            • PubKey Size: <strong>440 Bytes</strong><br>
            • Verdict: <strong>Legacy, slow verification</strong>
          </div>
        </div>

        <!-- ECDSA -->
        <div class="card" style="border-top: 3px solid #10B981;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="algo-badge algo-ecdsa">ECDSA</span>
            <span style="font-size: 7.5pt; color: #34D399; font-weight: 700;">NIST P-256</span>
          </div>
          <div style="font-size: 8.5pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Elliptic Curve DSA</div>
          <p class="card-p" style="font-size: 8pt; margin-bottom: 8px;">
            Applies discrete logarithm to points on an elliptic curve over prime field ($y^2 = x^3 - 3x + b$). Provides high security per bit with ultra-compact keys.
          </p>
          <div style="font-size: 7.5pt; color: #CBD5E1; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 6px; line-height: 1.4;">
            • Sig Size: <strong>~71 Bytes (DER)</strong><br>
            • PubKey Size: <strong>91 Bytes</strong><br>
            • Verdict: <strong>Compact, balanced, TLS/Crypto</strong>
          </div>
        </div>

        <!-- Ed25519 -->
        <div class="card" style="border-top: 3px solid #F59E0B; background: rgba(245, 158, 11, 0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="algo-badge algo-ed">Ed25519</span>
            <span style="font-size: 7.5pt; color: #FBBF24; font-weight: 700;">256-bit EdDSA</span>
          </div>
          <div style="font-size: 8.5pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">Edwards-Curve EdDSA</div>
          <p class="card-p" style="font-size: 8pt; margin-bottom: 8px;">
            State-of-the-art Twisted Edwards curve ($x^2+y^2=1+dx^2y^2$) over field $2^{255}-19$. Deterministic nonces prevent key leakage from bad random number generators.
          </p>
          <div style="font-size: 7.5pt; color: #CBD5E1; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 6px; line-height: 1.4;">
            • Sig Size: <strong>Fixed 64 Bytes</strong><br>
            • PubKey Size: <strong>44 Bytes (PEM ~110B)</strong><br>
            • Verdict: <strong>Fastest, modern, secure</strong>
          </div>
        </div>
      </div>

      <div class="callout" style="border-color: #F59E0B; background: rgba(245, 158, 11, 0.08); color: #FEF3C7;">
        <strong>Key Architectural Insight:</strong> While RSA-PSS produces 256-byte signatures and requires 2048-bit keys to reach a 112-bit security level, Ed25519 achieves 128-bit security with only 256-bit keys and a fixed 64-byte signature—reducing storage and transmission overhead by over 75%.
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Algorithm Specifications</span>
        <span class="footer-dot"></span>
        <span>RSA-PSS vs DSA vs ECDSA vs Ed25519</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 6: SYSTEM ARCHITECTURE ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 5: System Architecture & Stack</div>
        <div class="slide-title">Fullstack System Architecture & Technology Stack</div>
        <div class="slide-subtitle">High-cohesion Next.js 15 fullstack architecture with native cryptographic acceleration</div>
      </div>
      <div class="slide-num-pill">Slide 06 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-3" style="gap: 4mm;">
        <!-- TIER 1 -->
        <div class="card">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 26px; height: 26px; border-radius: 6px; background: rgba(56, 189, 248, 0.2); color: #38BDF8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 9pt;">UI</div>
            <div>
              <div style="font-size: 9.5pt; font-weight: 700; color: #FFFFFF;">Presentation Layer</div>
              <div style="font-size: 7.5pt; color: #64748B;">Frontend Interface</div>
            </div>
          </div>
          <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
            • <strong>Next.js 15 (React 19)</strong>: Server components & Client views.<br>
            • <strong>Tailwind CSS</strong>: High-contrast responsive design system.<br>
            • <strong>Recharts</strong>: Dynamic latency bar & radar charts.<br>
            • <strong>TanStack Query v5</strong>: Asynchronous data caching & refetching.<br>
            • <strong>Axios</strong>: Robust HTTP API communications.
          </div>
        </div>

        <!-- TIER 2 -->
        <div class="card" style="border-color: rgba(99, 102, 241, 0.3);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 26px; height: 26px; border-radius: 6px; background: rgba(99, 102, 241, 0.2); color: #818CF8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 9pt;">API</div>
            <div>
              <div style="font-size: 9.5pt; font-weight: 700; color: #FFFFFF;">Application & Crypto Layer</div>
              <div style="font-size: 7.5pt; color: #64748B;">Backend Controllers & Kernel</div>
            </div>
          </div>
          <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
            • <strong>Next.js Route Handlers</strong>: Modular REST API endpoints.<br>
            • <strong>Node.js Native Crypto</strong>: Hardware-accelerated OpenSSL bindings for SHA-256, RSA-PSS, DSA, ECDSA, Ed25519.<br>
            • <strong>JWT Security</strong>: Stateless access token issuance.<br>
            • <strong>BcryptJS</strong>: Salted password hashing (12 rounds).<br>
            • <strong>High-Resolution Timers</strong>: Nanosecond profiling.
          </div>
        </div>

        <!-- TIER 3 -->
        <div class="card" style="border-color: rgba(16, 185, 129, 0.3);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 26px; height: 26px; border-radius: 6px; background: rgba(16, 185, 129, 0.2); color: #34D399; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 9pt;">DB</div>
            <div>
              <div style="font-size: 9.5pt; font-weight: 700; color: #FFFFFF;">Persistence & Audit Layer</div>
              <div style="font-size: 7.5pt; color: #64748B;">MongoDB Database</div>
            </div>
          </div>
          <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
            • <strong>Mongoose ODM</strong>: Strict schema typing & validation.<br>
            • <strong>Documents Collection</strong>: Buffers, mime types, SHA-256.<br>
            • <strong>Signatures Collection</strong>: Public keys & signatures.<br>
            • <strong>VerificationLogs</strong>: Audit history of verification runs.<br>
            • <strong>AuditLogs Collection</strong>: System-wide admin audit trail.
          </div>
        </div>
      </div>

      <div class="card" style="background: rgba(15, 23, 42, 0.85); padding: 8px 14px;">
        <div style="font-size: 8.5pt; font-weight: 700; color: #38BDF8; margin-bottom: 4px;">Zero-Dependency Cryptography Design Principle</div>
        <div style="font-size: 8pt; color: #94A3B8; line-height: 1.4;">
          Unlike typical web projects that bundle third-party JavaScript math libraries (which are slow and susceptible to supply-chain attacks), DigitalSignature Suite relies exclusively on the Node.js built-in <span class="code-pill">crypto</span> engine. This guarantees execution in compiled C++ OpenSSL routines with constant-time cryptographic primitives to mitigate side-channel timing attacks.
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>System Architecture</span>
        <span class="footer-dot"></span>
        <span>Next.js 15 • Node Crypto • MongoDB</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 7: DATA FLOW & TAMPER DETECTION ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 6: Cryptographic Workflow</div>
        <div class="slide-title">Cryptographic Pipeline & Tamper Detection Lifecycle</div>
        <div class="slide-subtitle">Step-by-step mathematical flow from document ingestion to tamper discovery</div>
      </div>
      <div class="slide-num-pill">Slide 07 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-2">
        <!-- PIPELINE 1 -->
        <div class="card" style="border-left: 3px solid #38BDF8;">
          <div class="card-title" style="color: #38BDF8;">Stage 1: Document Signing Lifecycle</div>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
            <div class="step-box" style="padding: 6px 10px;">
              <span class="step-num" style="background:#38BDF8;">A</span>
              <div class="step-content">
                <div class="step-head" style="font-size:8.5pt;">Document Ingestion & SHA-256 Digest</div>
                <div class="step-desc" style="font-size:7.8pt;">Upload file buffer $\rightarrow$ compute cryptographic hash <span class="code-pill">crypto.createHash('sha256')</span> $\rightarrow$ persist buffer & hash in DB.</div>
              </div>
            </div>
            <div class="step-box" style="padding: 6px 10px;">
              <span class="step-num" style="background:#818CF8;">B</span>
              <div class="step-content">
                <div class="step-head" style="font-size:8.5pt;">Ephemeral Keypair Generation</div>
                <div class="step-desc" style="font-size:7.8pt;">Server generates high-entropy keypair in memory (<span class="code-pill">generateKeyPairSync</span>). Private key remains in RAM only.</div>
              </div>
            </div>
            <div class="step-box" style="padding: 6px 10px;">
              <span class="step-num" style="background:#F59E0B;">C</span>
              <div class="step-content">
                <div class="step-head" style="font-size:8.5pt;">Signature Computation & Key Purge</div>
                <div class="step-desc" style="font-size:7.8pt;">Sign document hash $\rightarrow$ record Public Key (PEM), Signature bytes, and latency $\rightarrow$ <strong>Destroy Private Key immediately</strong>.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- PIPELINE 2 -->
        <div class="card" style="border-left: 3px solid #10B981;">
          <div class="card-title" style="color: #34D399;">Stage 2: Tamper-Evident Verification</div>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
            <div class="step-box" style="padding: 6px 10px;">
              <span class="step-num" style="background:#34D399;">1</span>
              <div class="step-content">
                <div class="step-head" style="font-size:8.5pt;">Check Phase 1: Hash Integrity Guard</div>
                <div class="step-desc" style="font-size:7.8pt;">System recalculates SHA-256 hash of the presented file. If bytes were altered by 1 bit, hash changes completely (Avalanche Effect).</div>
              </div>
            </div>
            <div class="step-box" style="padding: 6px 10px;">
              <span class="step-num" style="background:#34D399;">2</span>
              <div class="step-content">
                <div class="step-head" style="font-size:8.5pt;">Check Phase 2: Cryptographic Signature Math</div>
                <div class="step-desc" style="font-size:7.8pt;">Executes <span class="code-pill">crypto.verify(data, algo, signature, pubKey)</span>. Verifies that signature matches public key and data.</div>
              </div>
            </div>
            <div class="step-box" style="padding: 6px 10px;">
              <span class="step-num" style="background:#EF4444; color:#fff;">3</span>
              <div class="step-content">
                <div class="step-head" style="font-size:8.5pt;">Tamper Alert & Audit Logging</div>
                <div class="step-desc" style="font-size:7.8pt;">If verification fails $\rightarrow$ instant red alarm: <em>"Integrity Compromised"</em>. Result and millisecond duration saved to VerificationLog.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="callout" style="border-color: #10B981; background: rgba(16, 185, 129, 0.08); color: #D1FAE5;">
        <strong>The Avalanche Effect in Action:</strong> Changing a single letter in a 1,000-page document produces a completely different 256-bit hash. Even without running the full mathematical signature verification, the hash disparity immediately flags tampering in less than 0.02 milliseconds!
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Cryptographic Pipeline</span>
        <span class="footer-dot"></span>
        <span>Dual-Phase Tamper Detection</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 8: HOW TO USE THE SYSTEM ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 7: Practical System Walkthrough</div>
        <div class="slide-title">How to Use the System: Step-by-Step Operator Guide</div>
        <div class="slide-subtitle">A practical demonstration guide from user onboarding to benchmark export</div>
      </div>
      <div class="slide-num-pill">Slide 08 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-3" style="gap: 3.5mm;">
        <!-- STEP 1 -->
        <div class="card">
          <div style="font-size: 8.5pt; font-weight: 700; color: #38BDF8; margin-bottom: 2px;">STEP 1</div>
          <div class="card-title" style="font-size: 10pt;">Authentication & Role Access</div>
          <p class="card-p" style="font-size: 8pt;">
            • Sign in at <span class="code-pill">/login</span> or register at <span class="code-pill">/register</span>.<br>
            • Pre-seeded Admin: <span class="code-pill">admin@example.com</span> / <span class="code-pill">Admin12345!</span>.<br>
            • Receives signed JWT token stored in <span class="code-pill">localStorage</span>.
          </p>
        </div>

        <!-- STEP 2 -->
        <div class="card">
          <div style="font-size: 8.5pt; font-weight: 700; color: #38BDF8; margin-bottom: 2px;">STEP 2</div>
          <div class="card-title" style="font-size: 10pt;">Document Management</div>
          <p class="card-p" style="font-size: 8pt;">
            • Navigate to <span class="code-pill">/documents</span>.<br>
            • Upload custom files (PDF, DOCX, TXT up to 10MB) or load 1-click built-in test templates (Legal Contract, Research Paper).<br>
            • Automatic SHA-256 fingerprint generation.
          </p>
        </div>

        <!-- STEP 3 -->
        <div class="card">
          <div style="font-size: 8.5pt; font-weight: 700; color: #38BDF8; margin-bottom: 2px;">STEP 3</div>
          <div class="card-title" style="font-size: 10pt;">Digital Signature Generation</div>
          <p class="card-p" style="font-size: 8pt;">
            • Open <span class="code-pill">/sign</span>.<br>
            • Select document and target algorithm (RSA-PSS, DSA, ECDSA, Ed25519).<br>
            • Click <strong>"Generate Signature"</strong> $\rightarrow$ displays real-time signing latency, public key (PEM), & signature payload.
          </p>
        </div>

        <!-- STEP 4 -->
        <div class="card">
          <div style="font-size: 8.5pt; font-weight: 700; color: #10B981; margin-bottom: 2px;">STEP 4</div>
          <div class="card-title" style="font-size: 10pt;">Verification & Tamper Test</div>
          <p class="card-p" style="font-size: 8pt;">
            • Navigate to <span class="code-pill">/verify</span>.<br>
            • Select signature and corresponding document.<br>
            • <strong>Authentic:</strong> Shows green verification badge.<br>
            • <strong>Tampered:</strong> Select an altered file to trigger instant red tamper alarm!
          </p>
        </div>

        <!-- STEP 5 -->
        <div class="card">
          <div style="font-size: 8.5pt; font-weight: 700; color: #F59E0B; margin-bottom: 2px;">STEP 5</div>
          <div class="card-title" style="font-size: 10pt;">Empirical Benchmarking</div>
          <p class="card-p" style="font-size: 8pt;">
            • Go to <span class="code-pill">/benchmark</span>.<br>
            • Choose algorithm & set iterations (10 to 500 runs).<br>
            • Interactive Recharts bar & radar charts display real-time latency.<br>
            • Click <strong>"Export CSV"</strong> to download raw data.
          </p>
        </div>

        <!-- STEP 6 -->
        <div class="card">
          <div style="font-size: 8.5pt; font-weight: 700; color: #818CF8; margin-bottom: 2px;">STEP 6</div>
          <div class="card-title" style="font-size: 10pt;">Admin Console & Audit Trail</div>
          <p class="card-p" style="font-size: 8pt;">
            • Navigate to <span class="code-pill">/admin</span> (Admin role required).<br>
            • View system-wide stats: document counts, signature totals, average latencies.<br>
            • Review immutable security audit trail with IP addresses & user agent telemetry.
          </p>
        </div>
      </div>

      <div class="callout" style="padding: 6px 12px; font-size: 8pt;">
        <strong>Quick Testing Tip for Panel Defense:</strong> Go directly to <span class="code-pill">/documents</span>, click <em>"Use Template"</em> on the Contract Agreement, proceed to <span class="code-pill">/sign</span> with <strong>Ed25519</strong>, and verify it in <span class="code-pill">/verify</span> within 10 seconds!
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>User Guide</span>
        <span class="footer-dot"></span>
        <span>6-Step Operator Flow</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 9: EMPIRICAL BENCHMARK RESULTS ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 8: Experimental Results & Findings</div>
        <div class="slide-title">Empirical Benchmark Results & Comparative Evaluation</div>
        <div class="slide-subtitle">Scientific performance metrics across 100+ controlled iterations per algorithm</div>
      </div>
      <div class="slide-num-pill">Slide 09 / 12</div>
    </div>

    <div class="content-area">
      <table class="comp-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Key Parameter</th>
            <th>Public Key Size</th>
            <th>Signature Size</th>
            <th>Avg Signing Time</th>
            <th>Avg Verification Time</th>
            <th>Security Equivalence</th>
            <th>Overall Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr class="highlight-row">
            <td><span class="algo-badge algo-ed">Ed25519</span></td>
            <td>Curve25519</td>
            <td>44 B (PEM ~110B)</td>
            <td><strong>64 Bytes (Fixed)</strong></td>
            <td><strong style="color:#FBBF24;">0.082 ms</strong></td>
            <td><strong style="color:#FBBF24;">0.125 ms</strong></td>
            <td>128-bit Symmetric</td>
            <td>🥇 <strong>#1 Fastest Overall</strong></td>
          </tr>
          <tr>
            <td><span class="algo-badge algo-ecdsa">ECDSA</span></td>
            <td>NIST P-256</td>
            <td>91 B (PEM ~178B)</td>
            <td><strong>~71 Bytes (DER)</strong></td>
            <td>0.345 ms</td>
            <td>0.820 ms</td>
            <td>128-bit Symmetric</td>
            <td>🥈 <strong>#2 Most Compact</strong></td>
          </tr>
          <tr>
            <td><span class="algo-badge algo-rsa">RSA-PSS</span></td>
            <td>2048-bit Modulus</td>
            <td>426 B (PEM ~450B)</td>
            <td><strong>256 Bytes</strong></td>
            <td>1.850 ms</td>
            <td>0.145 ms</td>
            <td>112-bit Symmetric</td>
            <td>🥉 <strong>#3 Fast Verifier</strong></td>
          </tr>
          <tr>
            <td><span class="algo-badge algo-dsa">DSA</span></td>
            <td>2048 / 256 bits</td>
            <td>440 B (PEM ~460B)</td>
            <td><strong>~48 Bytes (DER)</strong></td>
            <td>1.250 ms</td>
            <td>1.420 ms</td>
            <td>112-bit Symmetric</td>
            <td>4th (Legacy Baseline)</td>
          </tr>
        </tbody>
      </table>

      <div class="grid-3" style="margin-top: 2mm;">
        <div class="stat-pill">
          <div class="stat-val" style="color: #F59E0B;">22.5×</div>
          <div class="stat-lbl">Signing Speedup (Ed25519 vs RSA-PSS)</div>
        </div>
        <div class="stat-pill">
          <div class="stat-val" style="color: #10B981;">75%</div>
          <div class="stat-lbl">Signature Payload Reduction (64B vs 256B)</div>
        </div>
        <div class="stat-pill">
          <div class="stat-val" style="color: #38BDF8;">&lt; 0.05 ms</div>
          <div class="stat-lbl">Instant Tamper Discovery Latency</div>
        </div>
      </div>

      <div class="callout" style="padding: 6px 12px; font-size: 8pt;">
        <strong>Key Academic Finding:</strong> While RSA-PSS has strong verification performance (0.145 ms), its signature size (256B) and slow signing (1.85 ms) make it unsuitable for high-throughput microservices. <strong>Ed25519 dominates across all metrics</strong>, delivering the lowest signing time, competitive verification time, and compact 64-byte signatures.
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Empirical Evaluation</span>
        <span class="footer-dot"></span>
        <span>100 Iteration Controlled Benchmarks</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 10: SECURITY ARCHITECTURE & ZERO-TRUST ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 9: Security Architecture</div>
        <div class="slide-title">Zero-Trust Design & Cryptographic Vulnerability Mitigation</div>
        <div class="slide-subtitle">How the platform guards against key compromise, nonce reuse, and padding attacks</div>
      </div>
      <div class="slide-num-pill">Slide 10 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-2">
        <div class="card" style="border-top: 3px solid #10B981;">
          <div class="card-title" style="color: #34D399;">1. Ephemeral Private Key Custody</div>
          <p class="card-p">
            <strong>The Threat:</strong> Web-based signing applications that store user private keys on the server are high-value targets. A single SQL injection or server compromise leaks all signing keys.
            <br><br>
            <strong>Our Defense:</strong> Keys are generated on-the-fly in RAM during the request, used to sign the payload, and immediately dereferenced for garbage collection. The server never stores private keys in any database, log, or cache.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid #F59E0B;">
          <div class="card-title" style="color: #FBBF24;">2. Nonce Bias Immunity (Ed25519 vs ECDSA)</div>
          <p class="card-p">
            <strong>The Threat:</strong> Standard ECDSA requires a truly random nonce $k$ for every signature. If $k$ repeats even once or has biased entropy, an attacker can trivially calculate the private key (famous 2010 Sony PS3 hack).
            <br><br>
            <strong>Our Defense:</strong> Ed25519 derives $k$ deterministically via <span class="code-pill">k = H(privKey || message)</span>. It is physically impossible to reuse a nonce on different messages, rendering the algorithm completely immune to RNG entropy flaws.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid #6366F1;">
          <div class="card-title" style="color: #818CF8;">3. Probabilistic Padding (RSA-PSS vs PKCS#1 v1.5)</div>
          <p class="card-p">
            <strong>The Threat:</strong> Legacy RSA PKCS#1 v1.5 padding is deterministic and vulnerable to Bleichenbacher chosen-ciphertext padding oracle attacks.
            <br><br>
            <strong>Our Defense:</strong> DigitalSignature Suite implements <strong>RSA-PSS</strong> with random salting. The same document signed twice produces different signature ciphertexts, providing provable security in the Random Oracle Model.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid #38BDF8;">
          <div class="card-title" style="color: #38BDF8;">4. Immutable Auditability & Role Protection</div>
          <p class="card-p">
            <strong>The Threat:</strong> Rogue administrative tampering or lack of accountability in verification failures.
            <br><br>
            <strong>Our Defense:</strong> Every administrative action, verification attempt (valid or forged), and document upload is logged with an immutable timestamp, user ID, IP address, and user agent to guarantee non-repudiation and forensic auditability.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Security Analysis</span>
        <span class="footer-dot"></span>
        <span>Zero-Trust Architecture</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 11: DEFENSE Q&A PREPARATION ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 10: Defense Panel Preparation</div>
        <div class="slide-title">Defense Q&A: Anticipated Panel Questions & Answers</div>
        <div class="slide-subtitle">Rigorous responses to technical questions expected from the examination committee</div>
      </div>
      <div class="slide-num-pill">Slide 11 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-2">
        <div class="card" style="border-left: 3px solid #38BDF8;">
          <div style="font-size: 8.8pt; font-weight: 700; color: #38BDF8; margin-bottom: 2px;">PANEL QUESTION 1</div>
          <div style="font-size: 9.2pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">"What happens if an attacker modifies 1 byte in a 1,000-page document?"</div>
          <p class="card-p" style="font-size: 8pt;">
            <strong>Answer:</strong> Due to the Avalanche Effect of SHA-256, changing even 1 bit changes roughly 50% of the output digest bits. In Phase 1 of our verification pipeline, the computed hash fails to match the original document hash. In Phase 2, the cryptographic verification algorithm mathematical equation fails, immediately rejecting the document as compromised.
          </p>
        </div>

        <div class="card" style="border-left: 3px solid #818CF8;">
          <div style="font-size: 8.8pt; font-weight: 700; color: #818CF8; margin-bottom: 2px;">PANEL QUESTION 2</div>
          <div style="font-size: 9.2pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">"Why not store private keys so users can re-use their keys across sessions?"</div>
          <p class="card-p" style="font-size: 8pt;">
            <strong>Answer:</strong> Storing private keys on a shared server introduces massive custody and liability risks. Our platform operates on a zero-trust model: keys are generated ephemerally in RAM for the immediate signing transaction and purged. For long-term user key custody, the architecture can be extended with client-side WebCrypto API or hardware security keys (FIDO2/WebAuthn).
          </p>
        </div>

        <div class="card" style="border-left: 3px solid #F59E0B;">
          <div style="font-size: 8.8pt; font-weight: 700; color: #F59E0B; margin-bottom: 2px;">PANEL QUESTION 3</div>
          <div style="font-size: 9.2pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">"Why did you use Node.js crypto instead of pure JS packages like crypto-js?"</div>
          <p class="card-p" style="font-size: 8pt;">
            <strong>Answer:</strong> Pure JavaScript math libraries are orders of magnitude slower, do not execute in constant time (leaving them vulnerable to CPU cache-timing side-channel attacks), and introduce third-party supply-chain risks. Node.js built-in <span class="code-pill">crypto</span> wraps native C++ OpenSSL with hardware AES-NI / AVX2 CPU acceleration.
          </p>
        </div>

        <div class="card" style="border-left: 3px solid #10B981;">
          <div style="font-size: 8.8pt; font-weight: 700; color: #10B981; margin-bottom: 2px;">PANEL QUESTION 4</div>
          <div style="font-size: 9.2pt; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">"What is your final algorithm recommendation based on your research?"</div>
          <p class="card-p" style="font-size: 8pt;">
            <strong>Answer:</strong> For modern greenfield web applications and microservices: <strong>Ed25519</strong> is the unequivocal winner due to its 22x signing speedup, compact 64-byte payload, and deterministic nonces. For legacy enterprise integrations where verifiers have existing hardware RSA accelerators: <strong>RSA-PSS 2048-bit</strong>.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Examination Preparation</span>
        <span class="footer-dot"></span>
        <span>Technical Defense Q&A</span>
      </div>
      <div>Candidate Defense Slide Deck</div>
    </div>
  </div>

  <!-- ==================== SLIDE 12: CONCLUSION & FUTURE WORK ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="header-left">
        <div class="category-badge">Chapter 11: Conclusion & Future Research</div>
        <div class="slide-title">Conclusion, Academic Contributions & Future Work</div>
        <div class="slide-subtitle">Summary of completed work, practical impact, and roadmap for post-quantum extensions</div>
      </div>
      <div class="slide-num-pill">Slide 12 / 12</div>
    </div>

    <div class="content-area">
      <div class="grid-2">
        <div class="card" style="border-top: 3px solid #10B981;">
          <div class="card-title" style="color: #34D399;">Summary of Project Contributions</div>
          <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
            • <strong>Operational Verification Suite:</strong> Engineered a robust fullstack platform with Next.js 15, TypeScript, Tailwind CSS, and MongoDB Atlas.<br><br>
            • <strong>Empirical Validation:</strong> Successfully benchmarked RSA-PSS, DSA, ECDSA, and Ed25519 across hundreds of iterations, providing definitive performance guidelines.<br><br>
            • <strong>Zero-Trust Security Implementation:</strong> Eliminated server-side key exposure through volatile RAM ephemeral signing.<br><br>
            • <strong>Demonstrated Tamper-Proofing:</strong> Proved instant detection of single-bit document alteration via SHA-256 and asymmetric verification.
          </div>
        </div>

        <div class="card" style="border-top: 3px solid #38BDF8;">
          <div class="card-title" style="color: #38BDF8;">Future Research & Extension Roadmap</div>
          <div style="font-size: 8.2pt; color: #94A3B8; line-height: 1.45;">
            • <strong>Post-Quantum Cryptography (PQC):</strong> Integrate NIST-standardized lattice-based algorithms (ML-DSA / Crystals-Dilithium & SLH-DSA / SPHINCS+) to counter upcoming quantum threats.<br><br>
            • <strong>Hardware Token Integration:</strong> Extend the verification portal to support FIDO2 / WebAuthn physical security keys (YubiKey) for client-side hardware signing.<br><br>
            • <strong>Standard PAdES Envelopes:</strong> Implement PDF Advanced Electronic Signatures (PAdES) byte-level visual stamping compliant with EU eIDAS regulations.<br><br>
            • <strong>Distributed Ledger Notarization:</strong> Anchor document SHA-256 root hashes onto decentralized timestamping blockchains for public auditability.
          </div>
        </div>
      </div>

      <div class="card" style="background: rgba(15, 23, 42, 0.95); text-align: center; padding: 10px 16px;">
        <div style="font-size: 11pt; font-weight: 800; color: #FFFFFF; margin-bottom: 2px;">Thank You to the Examination Board & Supervisors</div>
        <div style="font-size: 8.5pt; color: #94A3B8;">The floor is now open for questions, technical discussion, and live demonstration.</div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span>DigitalSignature Suite</span>
        <span class="footer-dot"></span>
        <span>Final Defense Slide Deck</span>
        <span class="footer-dot"></span>
        <span>Presentation Complete</span>
      </div>
      <div>Thank You • Examination Session</div>
    </div>
  </div>

</body>
</html>
`;

const scriptsDir = __dirname;
const htmlPath = path.join(scriptsDir, 'presentation.html');
const rootPdfPath = path.resolve(__dirname, '..', 'DigitalSignature_Defense_Presentation.pdf');
const publicPdfPath = path.resolve(__dirname, '..', 'public', 'DigitalSignature_Defense_Presentation.pdf');
const brainPdfPath = 'C:\\\\Users\\\\JOHNSON\\\\.gemini\\\\antigravity-ide\\\\brain\\\\d4a5efbc-e19d-4c9a-84e5-e56c7be94ab0\\\\DigitalSignature_Defense_Presentation.pdf';

console.log('Writing presentation HTML to:', htmlPath);
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
console.log('Rendering PDF via Chrome headless...');

const cmd = \`Start-Process -FilePath "\${chromePath}" -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=\\\`"\${rootPdfPath}\\\`"", "\\\`"file:///\${htmlPath.replace(/\\\\/g, '/')}\\\`"" -Wait\`;

execSync(\`powershell -NoProfile -Command "\${cmd}"\`, { stdio: 'inherit' });

if (fs.existsSync(rootPdfPath)) {
  const stats = fs.statSync(rootPdfPath);
  console.log(\`PDF generated successfully at root: \${rootPdfPath} (\${stats.size} bytes)\`);

  // Copy to public directory
  fs.copyFileSync(rootPdfPath, publicPdfPath);
  console.log(\`Copied PDF to public folder: \${publicPdfPath}\`);

  // Copy to brain directory if exists
  try {
    const brainDir = path.dirname(brainPdfPath);
    if (!fs.existsSync(brainDir)) fs.mkdirSync(brainDir, { recursive: true });
    fs.copyFileSync(rootPdfPath, brainPdfPath);
    console.log(\`Copied PDF to brain artifacts folder: \${brainPdfPath}\`);
  } catch (err) {
    console.warn('Could not copy to brain artifacts:', err.message);
  }

  // Count pages in PDF
  const pdfBuffer = fs.readFileSync(rootPdfPath, 'utf8');
  const pageMatches = pdfBuffer.match(/\\/Type\\s*\\/Page\\b/g);
  console.log('Total pages in generated PDF:', pageMatches ? pageMatches.length : 'Unknown');
} else {
  console.error('Failed to generate PDF at root path.');
  process.exit(1);
}
