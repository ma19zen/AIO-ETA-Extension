(() => {
  "use strict";

  const HTTP_TIMEOUT = 60000;

  const SAP_CLIENT = "300";
  const SAP_LANG = "ar";
  const SAP_BASE = "https://fpascs.eta.gov.eg:44300";
  const SAP_SERVICE_PATH = "/sap/opu/odata/sap/ERP_FMCA_MC_SRV";
  const SAP_SERVICE_BASE = `${SAP_BASE}${SAP_SERVICE_PATH}`;
  const SAP_REFERER =
    `${SAP_BASE}/sap/bc/ui5_ui5/sap/ZETA_MCFAPP/index.html?sap-client=${SAP_CLIENT}&sap-language=${SAP_LANG}`;
  const SAP_ORIGIN = SAP_BASE;

  const VAT_DESC_AR = "ضريبة القيمة المضافة";
  const FORM_ID = "VTF3";
  const FORM_NO = "1";
  const TABLE_FORM = "";

  const ETAX_DECLARATIONS_URL =
    "https://eservice.incometax.gov.eg/ETax/ShowDeclarationsAddedValuee/FillModel110AKendoGrid";

  const ETAX_COMMON_HEADERS = {
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ar;q=0.6",
    "Connection": "keep-alive",
    "Host": "eservice.incometax.gov.eg",
    "Sec-Ch-Ua": '"Google Chrome";v="147", "Not=A?Brand";v="8", "Chromium";v="147"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "User-Agent": navigator.userAgent || "Mozilla/5.0"
  };

  const REP_TYPE_MAP = {
    "1": "مالك",
    "2": "مدير",
    "3": "وكيل"
  };

  const SAP_ID_TYPE_MAP = {
    "1": "البطاقة القومية",
    "2": "جواز السفر"
  };

  const ETAX_ID_TYPE_MAP = {
    1: "رقم قومي",
    2: "جواز سفر"
  };

  function log(...args) {
    console.log("[MF Signature Autofill]", ...args);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function tryJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function formatTodayDDMMYYYY() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  function parsePeriodIdToYearMonth(periodId) {
    if (periodId == null) return null;
    const s = String(periodId).trim();
    if (!/^\d+$/.test(s)) return null;

    if (s.length >= 6) {
      const year = parseInt(s.slice(-4), 10);
      const mm = parseInt(s.slice(0, -4), 10);
      if (mm >= 1 && mm <= 12 && year >= 1900 && year <= 2100) {
        return { year, month: mm };
      }
      return null;
    }

    const yy = parseInt(s.slice(-2), 10);
    const mm = parseInt(s.slice(0, -2), 10);
    const year = yy <= 79 ? 2000 + yy : 1900 + yy;
    if (mm >= 1 && mm <= 12 && year >= 1900 && year <= 2100) {
      return { year, month: mm };
    }
    return null;
  }

  function parseSapDateMs(v) {
    if (v == null) return 0;
    const m = String(v).match(/\/Date\((\-?\d+)\)\//);
    if (!m) return 0;
    const n = parseInt(m[1], 10);
    return Number.isFinite(n) ? n : 0;
  }

  function parseMsDate(value) {
    if (!value || typeof value !== "string") return 0;
    const digits = String(value).replace(/[^\d]/g, "");
    const n = parseInt(digits || "0", 10);
    return Number.isFinite(n) ? n : 0;
  }

  async function fetchWithTimeout(url, options = {}, timeout = HTTP_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: "include"
      });
    } finally {
      clearTimeout(timer);
    }
  }

  function getEl(selector) {
    return document.querySelector(selector);
  }

  function setNativeValue(el, value) {
    if (!el) return;
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && typeof desc.set === "function") {
      desc.set.call(el, value);
    } else {
      el.value = value;
    }
  }

  function dispatchAll(el) {
    if (!el) return;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter", code: "Enter" }));
    el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Enter", code: "Enter" }));
  }

  async function clearAndFill(selector, value) {
    const el = getEl(selector);
    if (!el) throw new Error(`العنصر غير موجود: ${selector}`);
    el.focus();
    setNativeValue(el, "");
    dispatchAll(el);
    await sleep(80);
    setNativeValue(el, value);
    dispatchAll(el);
    await sleep(180);
  }

  async function setSelectValue(selector, value) {
    const el = getEl(selector);
    if (!el) throw new Error(`العنصر غير موجود: ${selector}`);

    el.removeAttribute("readonly");
    el.removeAttribute("disabled");

    el.focus();
    el.value = String(value);
    dispatchAll(el);

    const option = Array.from(el.options || []).find(
      (opt) => String(opt.value) === String(value)
    );
    if (option) {
      option.selected = true;
    }

    dispatchAll(el);
    await sleep(150);
  }

  function extractJsonFromMultipart(raw) {
    const out = [];
    const regex = /HTTP\/1\.1\s+\d{3}.*?\r?\n\r?\n/gms;
    let match;

    while ((match = regex.exec(raw)) !== null) {
      const start = match.index + match[0].length;
      const tail = raw.slice(start);
      const boundaryPos = tail.indexOf("\r\n--");
      const body = boundaryPos === -1 ? tail : tail.slice(0, boundaryPos);

      const parts = body.split(/\r?\n\r?\n/);
      const bodyOnly = parts.length >= 2 ? parts.slice(1).join("\n\n").trim() : body.trim();

      const js = tryJson(bodyOnly);
      if (js !== null) out.push(js);
    }

    if (!out.length) {
      const js = tryJson(raw.trim());
      if (js !== null) out.push(js);
    }

    return out;
  }

  function pickDResults(allJson) {
    const results = [];
    for (const js of allJson) {
      if (js && typeof js === "object" && js.d && typeof js.d === "object") {
        if (Array.isArray(js.d.results)) {
          for (const row of js.d.results) {
            if (row && typeof row === "object") results.push(row);
          }
        }
      }
    }
    return results;
  }

  function pickPayloadWithD(allJson) {
    for (const js of allJson) {
      if (js && typeof js === "object" && js.d && typeof js.d === "object") {
        return js;
      }
    }
    throw new Error("لم يتم العثور على payload يحتوي على d");
  }

  function isSapPage() {
    return (
      location.origin === "https://fpascs.eta.gov.eg:44300" &&
      location.pathname === "/sap/bc/ui5_ui5/sap/ZETA_MCFAPP/index.html" &&
      location.hash === "#/Form/VTF1"
    );
  }

  function isEtaxPage() {
    return (
      location.origin === "https://eservice.incometax.gov.eg" &&
      /^\/ETax\/NonTableVatTax2023\/index\/\d+$/.test(location.pathname)
    );
  }

  function getCurrentMode() {
    if (isSapPage()) return "sap";
    if (isEtaxPage()) return "etax";
    return null;
  }

  async function sapGetAccountId() {
    const url =
      `${SAP_SERVICE_BASE}/AccountAddresses?$top=1&$select=AccountID&$format=json&sap-client=${encodeURIComponent(SAP_CLIENT)}`;

    const r = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Accept-Language": SAP_LANG,
        "Origin": SAP_ORIGIN,
        "Referer": SAP_REFERER,
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    const text = await r.text();
    log("sapGetAccountId status=", r.status, text.slice(0, 500));

    if (!r.ok) {
      throw new Error(`فشل جلب AccountID: ${r.status}`);
    }

    const data = JSON.parse(text);
    const row = (((data || {}).d || {}).results || [])[0] || {};
    const acc = row.AccountID;
    if (!acc) throw new Error("AccountID غير موجود");
    return String(acc);
  }

  async function sapFetchCsrf() {
    const metaUrl = `${SAP_SERVICE_BASE}/$metadata?sap-client=${encodeURIComponent(SAP_CLIENT)}`;

    const r = await fetchWithTimeout(metaUrl, {
      method: "GET",
      headers: {
        "Accept": "application/xml",
        "Accept-Language": SAP_LANG,
        "Origin": SAP_ORIGIN,
        "Referer": SAP_REFERER,
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "x-csrf-token": "Fetch"
      }
    });

    const text = await r.text();
    log("sapFetchCsrf status=", r.status, text.slice(0, 300));

    if (!r.ok) {
      throw new Error(`فشل جلب CSRF: ${r.status}`);
    }

    const token = r.headers.get("x-csrf-token") || r.headers.get("X-CSRF-Token");
    if (!token) throw new Error("x-csrf-token غير موجود");
    return token;
  }

  function sapBuildBatchBody(boundary, innerGetPath, csrf) {
    const lines = [
      `--${boundary}`,
      "Content-Type: application/http",
      "Content-Transfer-Encoding: binary",
      "",
      `GET ${SAP_SERVICE_PATH}/${innerGetPath} HTTP/1.1`,
      "X-REQUESTED-WITH: XMLHttpRequest",
      `Accept-Language: ${SAP_LANG}`,
      "Accept: application/json",
      "MaxDataServiceVersion: 2.0",
      "DataServiceVersion: 2.0"
    ];

    if (csrf) lines.push(`x-csrf-token: ${csrf}`);
    lines.push("", "", `--${boundary}--`, "");
    return lines.join("\r\n");
  }

  async function sapPostBatch(csrf, innerGetPath) {
    const boundary = `batch_${crypto.randomUUID().replace(/-/g, "")}`;
    const body = sapBuildBatchBody(boundary, innerGetPath, csrf);

    const r = await fetchWithTimeout(`${SAP_SERVICE_BASE}/$batch`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": SAP_LANG,
        "Origin": SAP_ORIGIN,
        "Referer": SAP_REFERER,
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "x-csrf-token": csrf,
        "MaxDataServiceVersion": "2.0",
        "DataServiceVersion": "2.0",
        "Content-Type": `multipart/mixed; boundary=${boundary}`
      },
      body
    });

    const text = await r.text();
    log("sapPostBatch status=", r.status, "inner=", innerGetPath, text.slice(0, 1200));

    if (!(r.status === 200 || r.status === 202)) {
      throw new Error(`Batch failed: ${r.status}\n${text.slice(0, 1000)}`);
    }

    return text;
  }

  function sapInnerGetFormbundles(accountId) {
    return (
      `Accounts('${accountId}')/FormBundles?` +
      `$format=json&$expand=Period&$orderby=ReceiptDate%20asc&` +
      `$filter=StatusID%20eq%20%27OPENED%27&sap-client=${encodeURIComponent(SAP_CLIENT)}`
    );
  }

  function sapInnerGetFormdataCustom(formBundleId, formId, formNo, tableForm) {
    return (
      `GetFormData?` +
      `FormBundleID='${formBundleId}'&` +
      `FormID='${formId}'&` +
      `FormNo='${formNo}'&` +
      `TableForm='${tableForm}'&` +
      `$format=json`
    );
  }

  function sapFilterVatFormbundles(rows) {
    return rows.filter((r) => {
      const desc = String(r.RevenueTypeDescription || "").trim();
      const fb = String(r.FormBundleID || "").trim();
      return desc === VAT_DESC_AR && !!fb;
    });
  }

  function sapPickLatestBundle(vatRows) {
    const scored = vatRows.map((r) => {
      const ym = parsePeriodIdToYearMonth(r.PeriodID);
      const receiptMs = parseSapDateMs(r.ReceiptDate);
      return {
        year: ym ? ym.year : 0,
        month: ym ? ym.month : 0,
        receiptMs,
        row: r
      };
    });

    scored.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      if (b.month !== a.month) return b.month - a.month;
      return b.receiptMs - a.receiptMs;
    });

    return scored.length ? scored[0].row : null;
  }

  function sapLoadItemsFromBatchResponseText(respText) {
    const payload = pickPayloadWithD(extractJsonFromMultipart(respText));
    const d = payload.d || {};
    const formDataStr = d.FormData;
    if (typeof formDataStr !== "string") throw new Error("FormData غير موجود");
    const items = JSON.parse(formDataStr);
    if (!Array.isArray(items)) throw new Error("FormData ليس list");
    return items.filter((x) => x && typeof x === "object");
  }

  function sapExtractFieldFromItems(items, fieldName) {
    for (const item of items || []) {
      const dataRows = item.DATA || [];
      for (const f of dataRows) {
        if (String(f.FIELDNAME || "").trim() === fieldName) {
          return String(f.FIELDVALUE || "").trim();
        }
      }
    }
    return "";
  }

  function sapExtractSignatureInfo(items) {
    const repCode = sapExtractFieldFromItems(items, "A_148_SIG_REP");
    const repName = sapExtractFieldFromItems(items, "A_150_SIG_NAM");
    const idTypeCode = sapExtractFieldFromItems(items, "A_152_SIG_TYPE");
    const nationalId = sapExtractFieldFromItems(items, "A_154_SIG_NID");
    const passportId = sapExtractFieldFromItems(items, "A_156_SIG_PID");

    return {
      representative_code: repCode,
      representative_type: REP_TYPE_MAP[repCode] || "غير معروف",
      representative_name: repName,
      identity_type_code: idTypeCode,
      identity_type: SAP_ID_TYPE_MAP[idTypeCode] || "غير معروف",
      identity_value: idTypeCode === "2" ? passportId : nationalId,
      national_id: nationalId,
      passport_id: passportId
    };
  }

  async function fetchSapSignatureData() {
    const accountId = await sapGetAccountId();
    const csrf = await sapFetchCsrf();

    const formBundlesText = await sapPostBatch(csrf, sapInnerGetFormbundles(accountId));
    const rows = pickDResults(extractJsonFromMultipart(formBundlesText));
    const vatRows = sapFilterVatFormbundles(rows);

    if (!vatRows.length) throw new Error("لم يتم العثور على VAT FormBundle");

    const latest = sapPickLatestBundle(vatRows);
    if (!latest) throw new Error("تعذر تحديد آخر VAT FormBundle");

    const formBundleId = String(latest.FormBundleID || "").trim();
    const formDataText = await sapPostBatch(
      csrf,
      sapInnerGetFormdataCustom(formBundleId, FORM_ID, FORM_NO, TABLE_FORM)
    );

    const items = sapLoadItemsFromBatchResponseText(formDataText);
    const signature = sapExtractSignatureInfo(items);

    return { account_id: accountId, form_bundle_id: formBundleId, signature };
  }

  async function fillSapSignatureFields(signature) {
    const repType = signature.representative_type || "";
    const repName = signature.representative_name || "";
    const idType = signature.identity_type || "";
    const nationalId = signature.national_id || signature.identity_value || "";
    const passportId = signature.passport_id || signature.identity_value || "";
    const today = formatTodayDDMMYYYY();

    await clearAndFill("#_VTF3_A_148_SIG_REP_input-inner", repType);
    await clearAndFill("#_VTF3_A_150_SIG_NAM_input-inner", repName);
    await clearAndFill("#_VTF3_A_152_SIG_TYPE_input-inner", idType);

    if (idType === "جواز السفر") {
      if (getEl("#_VTF3_A_156_SIG_PID_input-inner")) {
        await clearAndFill("#_VTF3_A_156_SIG_PID_input-inner", passportId);
      }
      if (getEl("#_VTF3_A_154_SIG_NID_input-inner")) {
        await clearAndFill("#_VTF3_A_154_SIG_NID_input-inner", "");
      }
    } else {
      if (getEl("#_VTF3_A_154_SIG_NID_input-inner")) {
        await clearAndFill("#_VTF3_A_154_SIG_NID_input-inner", nationalId);
      }
      if (getEl("#_VTF3_A_156_SIG_PID_input-inner")) {
        await clearAndFill("#_VTF3_A_156_SIG_PID_input-inner", "");
      }
    }

    await clearAndFill("#_VTF3_A_160_SIG_DAT_date-inner", today);
    await clearAndFill("#_VTF3_A_162_SIG_input-inner", repName);
  }

  async function fetchEtaxDeclarations() {
    const headers = {
      ...ETAX_COMMON_HEADERS,
      "Accept": "*/*",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Origin": "https://eservice.incometax.gov.eg",
      "Referer": "https://eservice.incometax.gov.eg/ETax/ShowDeclarationsAddedValue/ShowAddedValue",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "X-Requested-With": "XMLHttpRequest"
    };

    const data = new URLSearchParams({
      sort: "",
      page: "1",
      pageSize: "10000",
      group: "",
      filter: "",
      dateFrom110: "",
      dateTo110: ""
    });

    const response = await fetchWithTimeout(ETAX_DECLARATIONS_URL, {
      method: "POST",
      headers,
      body: data.toString()
    });

    const text = await response.text();
    log("fetchEtaxDeclarations status=", response.status, text.slice(0, 1200));

    if (!response.ok) {
      throw new Error(`فشل جلب الإقرارات: ${response.status}`);
    }

    const json = JSON.parse(text);
    return json;
  }

  function getCandidateSentRows(content) {
    const rows = content?.Data;
    if (!Array.isArray(rows)) return [];

    return rows.filter(
      (row) => String(row?.SendStatus || "").trim() === "تم إرسال النموذج"
    );
  }

  function getLatestSentDeclaration(content) {
    const sentRows = getCandidateSentRows(content);
    if (!sentRows.length) return null;

    function baseSortKey(row) {
      const taxPeriod = Number(row?.TaxPeriod || 0);
      const sendDate = parseMsDate(row?.SendDate);
      const updatedDate = parseMsDate(row?.UpdatedDate);
      const creationDate = parseMsDate(row?.CreationDate);
      return [taxPeriod, sendDate, updatedDate, creationDate];
    }

    sentRows.sort((a, b) => {
      const ka = baseSortKey(a);
      const kb = baseSortKey(b);
      for (let i = 0; i < ka.length; i++) {
        if (kb[i] !== ka[i]) return kb[i] - ka[i];
      }
      return 0;
    });

    const topKey = baseSortKey(sentRows[0]).join("|");
    const latestRows = sentRows.filter((row) => baseSortKey(row).join("|") === topKey);

    const amendedRows = latestRows.filter(
      (row) => String(row?.DeclarationTypeName || "").trim() === "إقرار معدل"
    );

    if (amendedRows.length) return amendedRows[0];
    return latestRows[0];
  }

  function buildEtaxOutputRow(row) {
    const personalizeTypeId = Number(row?.PersonalizeTypeID || 0);

    return {
      TaxPeriod: row?.TaxPeriod,
      SendStatus: row?.SendStatus,
      ApplicantName: row?.ApplicantName || "",
      Representitive: row?.Representitive || "",
      PersonalizeTypeID: personalizeTypeId,
      PersonalizeTypeName: ETAX_ID_TYPE_MAP[personalizeTypeId] || `نوع غير معروف (${personalizeTypeId})`,
      NationalPassNum: row?.NationalPassNum || "",
      DeclarationTypeName: row?.DeclarationTypeName || "",
      DocumentNum: row?.DocumentNum || ""
    };
  }

  async function fetchEtaxSignatureData() {
    const content = await fetchEtaxDeclarations();
    const latestSent = getLatestSentDeclaration(content);

    if (!latestSent) {
      throw new Error("لا يوجد أي إقرار تم إرساله");
    }

    return buildEtaxOutputRow(latestSent);
  }

  async function fillEtaxSignatureFields(data) {
    const applicantName = String(data?.ApplicantName || "").trim();
    const representative = String(data?.Representitive || "").trim();
    const personalizeTypeId = Number(data?.PersonalizeTypeID || 0);
    const nationalPassNum = String(data?.NationalPassNum || "").trim();

    await clearAndFill("#applicantName", applicantName);

    if (personalizeTypeId === 2) {
      await setSelectValue("#ddlPersonalizeType", "2");
    } else {
      await setSelectValue("#ddlPersonalizeType", "1");
    }

    await clearAndFill("#natNumber", nationalPassNum);

    const repSelectors = [
      "#Representitive",
      "input[name='Representitive']",
      "input[id='representitive']",
      "input[name='representitive']",
      "input[id='Representative']",
      "input[name='Representative']"
    ];

    let repFilled = false;
    for (const sel of repSelectors) {
      const el = getEl(sel);
      if (el) {
        await clearAndFill(sel, representative);
        repFilled = true;
        break;
      }
    }

    if (!repFilled) {
      log("لم يتم العثور على حقل الصفة، لكن باقي البيانات اتملاّت");
    }
  }

  async function handleAutofillByPageMode() {
    const mode = getCurrentMode();

    if (mode === "sap") {
      const data = await fetchSapSignatureData();
      await fillSapSignatureFields(data.signature);
      return {
        mode,
        summary: [
          "تم تعبئة بيانات التوقيع بنجاح",
          `الصفة: ${data.signature?.representative_type || "-"}`,
          `الاسم: ${data.signature?.representative_name || "-"}`,
          `نوع الإثبات: ${data.signature?.identity_type || "-"}`
        ].join("\n")
      };
    }

    if (mode === "etax") {
      const data = await fetchEtaxSignatureData();
      await fillEtaxSignatureFields(data);
      return {
        mode,
        summary: [
          "تم تعبئة بيانات التوقيع من آخر إقرار مُرسل",
          `الاسم: ${data.ApplicantName || "-"}`,
          `الصفة: ${data.Representitive || "-"}`,
          `نوع الإثبات: ${data.PersonalizeTypeName || "-"}`,
          `الرقم: ${data.NationalPassNum || "-"}`
        ].join("\n")
      };
    }

    throw new Error("الصفحة الحالية غير مدعومة");
  }

  function removeExistingUi() {
    const old = document.getElementById("eta-aio-signature-wrap");
    if (old) old.remove();
    const oldStyle = document.getElementById("eta-aio-signature-style");
    if (oldStyle) oldStyle.remove();
  }

  function ensureUi() {
    const mode = getCurrentMode();
    if (!mode) {
      removeExistingUi();
      return;
    }

    if (document.getElementById("eta-aio-signature-wrap")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "eta-aio-signature-style";
    style.textContent = `
      @keyframes etaAioFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes etaAioPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      #eta-aio-signature-wrap { font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
      #eta-aio-sig-btn { transition: all 0.2s ease; }
      #eta-aio-sig-btn:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(0,0,0,0.3); }
      #eta-aio-sig-btn:active { transform: translateY(0); }
      #eta-aio-sig-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
    `;
    document.documentElement.appendChild(style);

    const wrap = document.createElement("div");
    wrap.id = "eta-aio-signature-wrap";
    wrap.style.cssText = "position:fixed;top:16px;left:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;animation:etaAioFadeIn 0.3s ease;";

    const btn = document.createElement("button");
    btn.id = "eta-aio-sig-btn";
    btn.textContent = "\u270D\uFE0F \u062A\u0639\u0628\u0626\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0648\u0642\u064A\u0639";
    btn.style.cssText = "border:none;border-radius:10px;padding:10px 16px;cursor:pointer;background:rgba(15,23,42,0.92);color:#fff;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.25);min-width:180px;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);";

    const status = document.createElement("div");
    status.id = "eta-aio-sig-status";
    status.style.cssText = "background:rgba(15,23,42,0.92);color:#fff;padding:10px 12px;border-radius:10px;font-size:12px;line-height:1.6;max-width:320px;display:none;white-space:pre-wrap;box-shadow:0 8px 24px rgba(0,0,0,0.25);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);";

    let statusHideTimer = null;

    function setStatus(text, isError = false) {
      status.style.display = "block";
      status.textContent = text;
      status.style.borderColor = isError ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)";
      status.style.background = isError ? "rgba(127,29,29,0.92)" : "rgba(15,23,42,0.92)";

      if (statusHideTimer) clearTimeout(statusHideTimer);
      statusHideTimer = setTimeout(() => {
        status.style.display = "none";
        status.textContent = "";
      }, 3000);
    }

    btn.addEventListener("click", async () => {
      try {
        btn.disabled = true;
        btn.textContent = "\u23F3 \u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...";
        setStatus("\u062C\u0627\u0631\u064A \u062C\u0644\u0628 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0648\u0642\u064A\u0639...");

        const result = await handleAutofillByPageMode();
        setStatus(result.summary);
      } catch (err) {
        console.error(err);
        setStatus("\u274C " + (err.message || "\u062D\u0635\u0644 \u062E\u0637\u0623"), true);
      } finally {
        btn.disabled = false;
        btn.textContent = "\u270D\uFE0F \u062A\u0639\u0628\u0626\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0648\u0642\u064A\u0639";
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(status);
    document.documentElement.appendChild(wrap);
  }

  function boot() {
    ensureUi();

    const observer = new MutationObserver(() => {
      ensureUi();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    window.addEventListener("hashchange", () => {
      setTimeout(ensureUi, 200);
    });

    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        ensureUi();
      }
    }, 700);
  }

  chrome.storage.sync.get({ toggle_signature: true }, (toggles) => {
    if (toggles.toggle_signature !== false) {
      boot();
    }
  });
})();