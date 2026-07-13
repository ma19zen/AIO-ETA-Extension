(() => {
  "use strict";

  const _0x283903 = {
    _pendingRequests: new Map(),
    _requestId: 0,
    _sendMessage: function (_0x47a183, _0x4834c1) {
      return new Promise((_0x1590cc, _0x5d41f7) => {
        const _0x1f8fcb = this._requestId++;
        this._pendingRequests.set(_0x1f8fcb, {
          resolve: _0x1590cc,
          reject: _0x5d41f7
        });
        window.dispatchEvent(new CustomEvent("ETA_HELPER_REQUEST", {
          detail: {
            action: _0x47a183,
            data: _0x4834c1,
            requestId: _0x1f8fcb
          }
        }));
        setTimeout(() => {
          if (this._pendingRequests.has(_0x1f8fcb)) {
            _0x5d41f7(new Error("Request timed out for action: " + _0x47a183));
            this._pendingRequests.delete(_0x1f8fcb);
          }
        }, 10000);
      });
    },
    saveCredentials: function (_0x46eae9) {
      return this._sendMessage("saveCredentials", _0x46eae9);
    },
    loadCredentials: function () {
      return this._sendMessage("loadCredentials");
    },
    initListener: function () {
      window.addEventListener("ETA_HELPER_RESPONSE", _0x46c5fc => {
        const {
          requestId: _0x11e97e,
          success: _0x50c745,
          response: _0x148649,
          error: _0x262978
        } = _0x46c5fc.detail;
        if (this._pendingRequests.has(_0x11e97e)) {
          const {
            resolve: _0x409401,
            reject: _0x378fdf
          } = this._pendingRequests.get(_0x11e97e);
          if (_0x50c745) {
            _0x409401(_0x148649);
          } else {
            _0x378fdf(new Error(_0x262978));
          }
          this._pendingRequests.delete(_0x11e97e);
        }
      });
    }
  };
  _0x283903.initListener();
  function _showToast(_msg, _type) {
    if (!_type) {
      if (_msg.includes('\u2705')) _type = 'success';
      else if (_msg.includes('\u274C') || _msg.includes('\u2757') || _msg.includes('\u2753')) _type = 'error';
      else _type = 'info';
    }
    var _colors = { success: '#a6e3a1', error: '#f38ba8', info: '#89b4fa' };
    var _icons = { success: '\u2705', error: '\u274C', info: '\u2139\uFE0F' };
    var _c = document.createElement('div');
    _c.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647;font-family:Segoe UI,Tahoma,sans-serif;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;';
    var _t = document.createElement('div');
    _t.style.cssText = 'background:#1e1e2e;color:#cdd6f4;padding:14px 22px;border-radius:12px;border:1px solid #313244;border-left:4px solid ' + _colors[_type] + ';box-shadow:0 8px 25px rgba(0,0,0,0.4);font-size:14px;max-width:480px;text-align:center;direction:rtl;animation:mmmToastIn 0.3s ease;pointer-events:auto;';
    _t.textContent = _msg;
    var _close = document.createElement('span');
    _close.textContent = '\u2715';
    _close.style.cssText = 'position:absolute;top:6px;left:10px;cursor:pointer;color:#6c7086;font-size:12px;line-height:1;';
    _close.addEventListener('click', function() { _t.remove(); _c.remove(); });
    _t.style.position = 'relative';
    _t.appendChild(_close);
    _c.appendChild(_t);
    document.body.appendChild(_c);
    setTimeout(function() {
      _t.style.animation = 'mmmToastOut 0.3s ease forwards';
      setTimeout(function() { _c.remove(); }, 300);
    }, 4000);
  }
  var _toastStyle = document.createElement('style');
  _toastStyle.textContent = '@keyframes mmmToastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes mmmToastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(20px)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes zoomIn{from{transform:scale(.95)}to{transform:scale(1)}}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#181825;border-radius:3px}::-webkit-scrollbar-thumb{background:#45475a;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#585b70}';
  document.head.appendChild(_toastStyle);
  function _customConfirm(_msg) {
    return new Promise(function(resolve) {
      var _ov = document.createElement('div');
      _ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:2147483647;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fadeIn 0.2s;';
      var _box = document.createElement('div');
      _box.style.cssText = 'background:#1e1e2e;padding:28px 32px;border-radius:16px;border:1px solid #313244;box-shadow:0 20px 60px rgba(0,0,0,0.5);max-width:420px;width:90%;text-align:center;font-family:Segoe UI,Tahoma,sans-serif;direction:rtl;';
      var _icon = document.createElement('div');
      _icon.textContent = '\u2757';
      _icon.style.cssText = 'font-size:36px;margin-bottom:12px;';
      var _text = document.createElement('p');
      _text.textContent = _msg;
      _text.style.cssText = 'color:#cdd6f4;font-size:15px;line-height:1.7;margin:0 0 24px 0;';
      var _btns = document.createElement('div');
      _btns.style.cssText = 'display:flex;gap:12px;justify-content:center;';
      var _yes = document.createElement('button');
      _yes.textContent = '\u0646\u0639\u0645';
      _yes.style.cssText = 'background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;padding:10px 28px;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px;';
      var _no = document.createElement('button');
      _no.textContent = '\u0625\u063A\u0644\u0627\u0642';
      _no.style.cssText = 'background:#313244;color:#cdd6f4;border:none;padding:10px 28px;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px;';
      _yes.addEventListener('click', function() { _ov.remove(); resolve(true); });
      _no.addEventListener('click', function() { _ov.remove(); resolve(false); });
      _ov.addEventListener('click', function(e) { if (e.target === _ov) { _ov.remove(); resolve(false); } });
      _btns.appendChild(_yes);
      _btns.appendChild(_no);
      _box.appendChild(_icon);
      _box.appendChild(_text);
      _box.appendChild(_btns);
      _ov.appendChild(_box);
      document.body.appendChild(_ov);
    });
  }
  const _0x2a3762 = 15;
  const _0x376c17 = 30000;
  const _0x275e29 = 2;
  function _0x1b6b8c(_0x369aa6) {
    if (!_0x369aa6) {
      return "unknown";
    }
    return String(_0x369aa6).trim().replace(/\s+/g, "_").replace(/[\\\/:*?"<>|]/g, "_").slice(0, 120);
  }
  function _getCustName(_0x616a65) {
    return _0x616a65.CustomerName || _0x616a65.companyName || "";
  }
  function _migrateCustName(_0x616a65) {
    if (_0x616a65.companyName && !_0x616a65.CustomerName) {
      _0x616a65.CustomerName = _0x616a65.companyName;
      delete _0x616a65.companyName;
    }
  }
  function _0x547395() {
    const _0x5b26e4 = document.querySelector("h1.main-title");
    if (!_0x5b26e4) {
      return;
    }
    if (!document.getElementById("autofill-management-btn")) {
      const _0x41b31e = document.createElement("a");
      _0x41b31e.id = "autofill-management-btn";
      _0x41b31e.href = "#";
      _0x41b31e.textContent = "إدارة بيانات الملء التلقائي";
      _0x41b31e.className = "btn btn-style2 btn-block";
      _0x41b31e.style.marginBottom = "15px";
      _0x41b31e.style.backgroundColor = "#6366f1";
      _0x41b31e.style.borderColor = "#6366f1";
      _0x41b31e.style.borderRadius = "10px";
      _0x41b31e.style.color = "#fff";
      _0x41b31e.style.transition = "all 0.2s ease";
      _0x5b26e4.parentElement.insertBefore(_0x41b31e, _0x5b26e4);
      _0x41b31e.addEventListener("click", _0x368b7d => {
        _0x368b7d.preventDefault();
        _0x1140d2();
      });
    }
    if (!document.getElementById("company-search-container")) {
      const _0x532c13 = document.getElementById("autofill-management-btn");
      const _0x1b04ee = document.createElement("div");
      _0x1b04ee.id = "company-search-container";
      _0x1b04ee.style.position = "relative";
      _0x1b04ee.style.marginBottom = "20px";
      const _0x3ea7ca = document.createElement("input");
      _0x3ea7ca.id = "company-search-box";
      _0x3ea7ca.type = "text";
      _0x3ea7ca.placeholder = "🔍 أو ابحث باسم العميل أو الشركة لملء البيانات...";
      _0x3ea7ca.autocomplete = "off";
      _0x3ea7ca.className = "form-control";
      _0x1b04ee.appendChild(_0x3ea7ca);
      _0x532c13.insertAdjacentElement("afterend", _0x1b04ee);
      _0x3ea7ca.addEventListener("input", _0x1cfd9e);
    }
  }
  async function _0x1cfd9e(_0x15a29e) {
    const _0x32e852 = _0x15a29e.target.value.toLowerCase().trim();
    const _0x36737f = _0x15a29e.target.parentElement;
    _0x36737f.querySelector("#company-autocomplete-list")?.remove();
    if (_0x32e852.length < 1) {
      return;
    }
    const _0x2c528b = await _0x283903.loadCredentials();
    if (!_0x2c528b || !_0x2c528b.success || !_0x2c528b.data) {
      return;
    }
    const _0x55533e = _0x2c528b.data;
    Object.values(_0x55533e).forEach(_migrateCustName);
    const _0x2c00cd = Object.entries(_0x55533e).filter(([_0x147dd7, _0x2f6e4b]) => _getCustName(_0x2f6e4b) && _getCustName(_0x2f6e4b).toLowerCase().startsWith(_0x32e852));
    if (_0x2c00cd.length === 0) {
      return;
    }
    const _0xb20890 = document.createElement("div");
    _0xb20890.id = "company-autocomplete-list";
    _0xb20890.style.cssText = "\n        position: absolute; border: 1px solid #313244; background-color: #1e1e2e;\n        width: 100%; max-height: 200px; overflow-y: auto; z-index: 9999;\n        top: 100%; left: 0; box-shadow: 0 8px 25px rgba(0,0,0,0.4); border-radius: 10px;\n    ";
    _0x2c00cd.forEach(([_0x27e33c, _0x406782]) => {
      const _0x3ee8fb = document.createElement("div");
      const _0xa02a22 = _getCustName(_0x406782);
      const _0x16a5d0 = _0xa02a22.toLowerCase().indexOf(_0x32e852);
      if (_0x16a5d0 === 0) {
        _0x3ee8fb.innerHTML = "<strong>" + _0xa02a22.substring(0, _0x32e852.length) + "</strong>" + _0xa02a22.substring(_0x32e852.length);
      } else {
        _0x3ee8fb.textContent = _0xa02a22;
      }
      _0x3ee8fb.style.cssText = "padding: 10px; cursor: pointer; border-bottom: 1px solid #313244; color: #cdd6f4;";
      _0x3ee8fb.addEventListener("mouseover", () => _0x3ee8fb.style.backgroundColor = "#313244");
      _0x3ee8fb.addEventListener("mouseout", () => _0x3ee8fb.style.backgroundColor = "#1e1e2e");
      _0x3ee8fb.addEventListener("click", () => {
        const _0x33e155 = document.querySelector("#userNameInput");
        const _0xfcd342 = document.querySelector("#userPwdInput");
        if (_0x33e155 && _0xfcd342) {
          _0x33e155.value = _0x27e33c;
          _0xfcd342.value = _0x406782.password;
          _0x33e155.dispatchEvent(new Event("input", {
            bubbles: true
          }));
          _0xfcd342.dispatchEvent(new Event("input", {
            bubbles: true
          }));
        }
        _0xb20890.remove();
        _0x15a29e.target.value = "";
      });
      _0xb20890.appendChild(_0x3ee8fb);
    });
    _0x36737f.appendChild(_0xb20890);
  }
  async function _0x1140d2() {
    document.getElementById("excel-helper-modal")?.remove();
    const _0x1a8255 = document.createElement("div");
    _0x1a8255.id = "excel-helper-modal";
    _0x1a8255.style.cssText = "\n        position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n        background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2147483647; display: flex;\n        align-items: center; justify-content: center; font-family: 'Segoe UI', sans-serif;\n    ";
    const _0x1f7d88 = document.createElement("div");
    _0x1f7d88.style.cssText = "\n        background: #1e1e2e; padding: 25px; border-radius: 16px; width: 500px;\n        box-shadow: 0 20px 60px rgba(0,0,0,0.5); text-align: right; direction: rtl; color: #cdd6f4; border: 1px solid #313244;\n    ";
    let _0x4bd4bf = 0;
    try {
      const _0x2737a3 = await _0x283903.loadCredentials();
      if (_0x2737a3 && _0x2737a3.success && _0x2737a3.data) {
        _0x4bd4bf = Object.keys(_0x2737a3.data).length;
      }
    } catch (_0x2bd09c) {}
    _0x1f7d88.innerHTML = "\n        <div style=\"display:flex;align-items:center;gap:12px;margin-bottom:18px;border-bottom:1px solid #313244;padding-bottom:15px;\">\n            <div style=\"width:28px;height:28px;border-radius:6px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;\">M</div>\n            <h3 style=\"margin:0;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:18px;\">إدارة الملء التلقائي</h3>\n        </div>\n        <div style=\"margin: 15px 0; padding: 12px; background: #181825; border: 1px solid #313244; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #a6adc8;\">\n            <b>🔒 للحفاظ على بياناتك:</b> تأكد من أنك قمت بتسجيل الدخول إلى متصفح كروم وأن مزامنة الإضافات مُفعّلة.\n        </div>\n        <div style=\"margin: 20px 0; padding: 10px; background: #181825; border-right: 4px solid #6366f1; border-radius: 8px; color: #cdd6f4;\">\n            <b>الحالة الحالية:</b> يوجد <strong style=\"color: #89b4fa;\">" + _0x4bd4bf + "</strong> حساب محفوظ.\n        </div>\n        <div style=\"display: flex; gap: 10px; margin-top: 20px;\">\n            <button id=\"upload-excel-btn\" class=\"modal-btn primary\">⬆️ رفع Excel</button>\n            <button id=\"view-data-btn\" class=\"modal-btn info\" " + (_0x4bd4bf === 0 ? "disabled" : "") + ">👁️ عرض البيانات</button>\n            <button id=\"download-template-btn\" class=\"modal-btn secondary\">📄 تحميل النموذج</button>\n        </div>\n        <div style=\"margin-top: 15px;\">\n             <button id=\"clear-storage-btn\" class=\"modal-btn danger\" style=\"width: 100%;\" " + (_0x4bd4bf === 0 ? "disabled" : "") + ">🗑️ حذف كل البيانات</button>\n        </div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-top:20px;\">\n            <button id=\"close-modal-btn\" style=\"background:none;border:none;color:#6c7086;cursor:pointer;font-size:13px;\">إغلاق</button>\n            <span style=\"color:#585b70;font-size:11px;\">MMM v1.0 based on Mohammed Sabry pass-manager</span>\n        </div>\n    ";
    _0x1a8255.appendChild(_0x1f7d88);
    document.body.appendChild(_0x1a8255);
    const _0xfffb19 = document.createElement("style");
    _0xfffb19.textContent = "\n        .modal-btn { padding: 10px 15px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; flex-grow: 1; transition: all 0.2s ease; font-size: 13px; }\n        .modal-btn.primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }\n        .modal-btn.primary:hover { box-shadow: 0 4px 15px rgba(99,102,241,0.4); transform: translateY(-1px); }\n        .modal-btn.secondary { background: #313244; color: #cdd6f4; }\n        .modal-btn.secondary:hover { background: #45475a; }\n        .modal-btn.danger { background: linear-gradient(135deg, #f38ba8, #eba0ac); color: #1e1e2e; }\n        .modal-btn.info { background: linear-gradient(135deg, #89b4fa, #74c7ec); color: #1e1e2e; }\n        .modal-btn:disabled { background: #313244; color: #585b70; cursor: not-allowed; }\n    ";
    _0x1f7d88.appendChild(_0xfffb19);
    const _0x3035f7 = _0x1f7d88.querySelector("#view-data-btn");
    if (_0x3035f7) {
      _0x3035f7.addEventListener("click", () => {
        _0x1a8255.remove();
        _0x3c7288();
      });
    } else {}
    const _0x4f8f40 = _0x1f7d88.querySelector("#close-modal-btn");
    if (_0x4f8f40) {
      _0x4f8f40.addEventListener("click", () => _0x1a8255.remove());
    }
    _0x1a8255.addEventListener("click", _0x8f4ac6 => {
      if (_0x8f4ac6.target === _0x1a8255) {
        _0x1a8255.remove();
      }
    });
    const _0x1a01c0 = document.createElement("input");
    _0x1a01c0.type = "file";
    _0x1a01c0.accept = ".xlsx, .xls";
    _0x1a01c0.style.display = "none";
    _0x1f7d88.appendChild(_0x1a01c0);
    const _0x5a0c0d = _0x1f7d88.querySelector("#upload-excel-btn");
    if (_0x5a0c0d) {
      _0x5a0c0d.addEventListener("click", () => _0x1a01c0.click());
    }
    _0x1a01c0.addEventListener("change", _0x5ddcf3 => {
      _0x56215e(_0x5ddcf3.target.files[0]);
      _0x1a8255.remove();
    });
    const _0x421567 = _0x1f7d88.querySelector("#download-template-btn");
    if (_0x421567) {
      _0x421567.addEventListener("click", _0x28c994);
    }
    const _0xb9d108 = _0x1f7d88.querySelector("#clear-storage-btn");
    if (_0xb9d108) {
      _0xb9d108.addEventListener("click", async () => {
        if (await _customConfirm("هل أنت متأكد أنك تريد حذف جميع بيانات تسجيل الدخول المحفوظة؟")) {
          try {
            await _0x283903.saveCredentials({});
            _showToast("✅ تم حذف جميع البيانات المحفوظة بنجاح.");
            _0x1a8255.remove();
          } catch (_0x6daccb) {
            _showToast("حدث خطأ أثناء محاولة حذف البيانات.");
          }
        }
      });
    }
  }
  async function _0x3c7288() {
    document.getElementById("data-viewer-modal")?.remove();
    document.getElementById("data-viewer-style")?.remove();
    let _0x219b94 = {};
    try {
      const _0x2617a5 = await _0x283903.loadCredentials();
      if (_0x2617a5 && _0x2617a5.success && _0x2617a5.data) {
        _0x219b94 = _0x2617a5.data;
        Object.values(_0x219b94).forEach(_migrateCustName);
      }
    } catch (_0x5b80e1) {
      _showToast("فشل في تحميل البيانات المحفوظة. تأكد من أن الإضافة تعمل بشكل صحيح.");
      return;
    }
    const _0x9699ec = document.createElement("div");
    _0x9699ec.id = "data-viewer-modal";
    _0x9699ec.innerHTML = "\n        <div class=\"viewer-modal-content\">\n            <div class=\"viewer-modal-header\">\n                <h3>عرض وتعديل البيانات المحفوظة</h3>\n                <button id=\"close-viewer-btn\" class=\"viewer-close-btn\">&times;</button>\n            </div>\n            <div class=\"viewer-modal-body\">\n                <div class=\"viewer-actions\">\n                    <button id=\"export-data-btn\" class=\"viewer-btn export-btn\">📄 تصدير نسخة احتياطية (Excel)</button>\n                                    </div>\n                <div class=\"viewer-table-container\">\n                    <table>\n                        <thead>\n                            <tr>\n                                <th>اسم العميل</th>\n                                <th>اسم المستخدم</th>\n                                <th>كلمة المرور</th>\n                                <th>إجراءات</th>\n                            </tr>\n                        </thead>\n                        <tbody id=\"viewer-table-body\"></tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n    ";
    document.body.appendChild(_0x9699ec);
    const _0x18b0f0 = document.createElement("style");
    _0x18b0f0.id = "data-viewer-style";
    _0x18b0f0.textContent = "\n        #data-viewer-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', sans-serif; direction: rtl; }\n        .viewer-modal-content { background: #1e1e2e; border-radius: 16px; width: 90%; max-width: 850px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); display: flex; flex-direction: column; max-height: 90vh; animation: zoomIn 0.3s; border: 1px solid #313244; color: #cdd6f4; }\n        @keyframes zoomIn { from { transform: scale(0.95); } to { transform: scale(1); } }\n        .viewer-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; border-bottom: 1px solid #313244; }\n        .viewer-modal-header h3 { margin: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n        .viewer-close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #6c7086; }\n        .viewer-close-btn:hover { color: #f38ba8; }\n        .viewer-modal-body { padding: 25px; overflow-y: auto; }\n        .viewer-actions { margin-bottom: 20px; }\n        .viewer-btn { padding: 8px 15px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; color: white; transition: all 0.2s; }\n        .export-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); }\n                .delete-btn { background: linear-gradient(135deg, #f38ba8, #eba0ac); color: #1e1e2e; }\n        .viewer-table-container { border: 1px solid #313244; border-radius: 10px; overflow: hidden; }\n        .viewer-table-container table { width: 100%; border-collapse: collapse; }\n        .viewer-table-container th, .viewer-table-container td { padding: 12px; text-align: center; border-bottom: 1px solid #313244; }\n        .viewer-table-container thead { background-color: #181825; }\n        .viewer-table-container th { color: #a6adc8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }\n        .viewer-table-container tbody tr:hover { background-color: #313244; transition: background-color 0.15s ease; }\n        .viewer-table-container tbody tr:last-child td { border-bottom: none; }\n        .viewer-table-container input { width: 95%; padding: 8px; border: 1px solid #313244; border-radius: 6px; box-sizing: border-box; background: #181825; color: #cdd6f4; }\n        .viewer-table-container input:focus { border-color: #6366f1; outline: none; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }\n        .viewer-modal-body::-webkit-scrollbar{width:6px}.viewer-modal-body::-webkit-scrollbar-track{background:#181825;border-radius:3px}.viewer-modal-body::-webkit-scrollbar-thumb{background:#45475a;border-radius:3px}.viewer-modal-body::-webkit-scrollbar-thumb:hover{background:#585b70}\n    ";
    document.head.appendChild(_0x18b0f0);
    const _0x24c426 = _0x9699ec.querySelector("#viewer-table-body");
    const _0x2f44e1 = () => {
      _0x24c426.innerHTML = "";
      if (!_0x219b94 || Object.keys(_0x219b94).length === 0) {
        _0x24c426.innerHTML = "<tr><td colspan=\"4\" style=\"padding: 25px; color: #585b70;\">لا توجد بيانات محفوظة.</td></tr>";
        return;
      }
      Object.entries(_0x219b94).forEach(([_0x14cbbc, _0x363009]) => {
        if (!_0x363009 || typeof _0x363009 !== "object") return;
        const _0x41f07a = document.createElement("tr");
        _0x41f07a.dataset.originalUsername = _0x14cbbc;
        _0x41f07a.innerHTML = "\n                <td><input type=\"text\" value=\"" + (_getCustName(_0x363009)) + "\" data-field=\"CustomerName\"></td>\n                <td><input type=\"text\" value=\"" + _0x14cbbc + "\" data-field=\"username\"></td>\n                <td><input type=\"text\" value=\"" + (_0x363009.password || "") + "\" data-field=\"password\"></td>\n                <td>\n                    <button class=\"delete-row-btn viewer-btn delete-btn\">حذف</button>\n                </td>\n            ";
        _0x24c426.appendChild(_0x41f07a);
      });
    };
    _0x2f44e1();
    _0x24c426.addEventListener("click", async _0x2b2db4 => {
      const _0x5d0d23 = _0x2b2db4.target.closest("tr");
      if (!_0x5d0d23) {
        return;
      }
      const _0x462eac = _0x5d0d23.dataset.originalUsername;
        if (_0x2b2db4.target.classList.contains("delete-row-btn")) {
          const _0x3f8a1c = _0x5d0d23.querySelector("[data-field=\"CustomerName\"]").value || _0x462eac;
          if (await _customConfirm("هل أنت متأكد أنك تريد حذف \"" + _0x3f8a1c + "\"؟")) {
          delete _0x219b94[_0x462eac];
          try {
            await _0x283903.saveCredentials(_0x219b94);
            _showToast("🗑️ تم الحذف بنجاح.");
            _0x2f44e1();
          } catch (_0x51fafd) {
            _showToast("❌ فشل الحذف.");
          }
        }
      }
    });
    _0x9699ec.querySelector("#export-data-btn").addEventListener("click", () => {
      _0x31ccf0(_0x219b94);
    });
    const _0x2f2ecd = () => {
      _0x9699ec.remove();
      _0x18b0f0.remove();
    };
    _0x9699ec.querySelector("#close-viewer-btn").addEventListener("click", _0x2f2ecd);
    _0x9699ec.addEventListener("click", _0x31c66b => {
      if (_0x31c66b.target === _0x9699ec) {
        _0x2f2ecd();
      }
    });
  }
  function _0x28c994() {
    if (typeof ExcelJS === "undefined") {
      _showToast("مكتبة ExcelJS غير محملة.");
      return;
    }
    const _0x3d1b5f = new ExcelJS.Workbook();
    const _0xd0f99f = _0x3d1b5f.addWorksheet("بيانات الدخول");
    _0xd0f99f.columns = [{
      header: "اسم العميل (Customer Name)",
      key: "company",
      width: 40
    }, {
      header: "اسم المستخدم (Username)",
      key: "username",
      width: 40
    }, {
      header: "كلمة المرور (Password)",
      key: "password",
      width: 40
    }];
    _0xd0f99f.addRow({
      company: "الشركة",
      username: "test",
      password: "123"
    });
    _0xd0f99f.getRow(1).font = {
      bold: true
    };
    _0x3d1b5f.xlsx.writeBuffer().then(_0x53f463 => {
      const _0x1f169e = new Blob([_0x53f463], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      saveAs(_0x1f169e, "نموذج_بيانات_الدخول_الجديد.xlsx");
    }).catch(_0x1843d4 => {
      _showToast("حدث خطأ أثناء إنشاء ملف النموذج.");
    });
  }
  async function _0x56215e(_0x41fc6c) {
    if (!_0x41fc6c) {
      return;
    }
    if (typeof ExcelJS === "undefined") {
      _showToast("مكتبة ExcelJS غير محملة. تأكد من وجودها في المشروع.");
      return;
    }
    const _0x590a17 = new FileReader();
    _0x590a17.onload = async _0x48172e => {
      try {
        const _0x31ab3d = new ExcelJS.Workbook();
        await _0x31ab3d.xlsx.load(_0x48172e.target.result);
        const _0x44b069 = _0x31ab3d.worksheets[0];
        const _0x7d5906 = {};
        let _0x40a527 = 0;
        _0x44b069.eachRow((_0xbfb0c8, _0x309d06) => {
          if (_0x309d06 > 1) {
            const _0x6baa90 = _0xbfb0c8.getCell(1).value;
            const _0xfaf66c = _0xbfb0c8.getCell(2).value;
            const _0x5a2cc5 = _0xbfb0c8.getCell(3).value;
            if (_0xfaf66c && _0x5a2cc5) {
              const _0x4a6ce7 = String(_0xfaf66c).trim();
              _0x7d5906[_0x4a6ce7] = {
                CustomerName: _0x6baa90 ? String(_0x6baa90).trim() : "",
                password: String(_0x5a2cc5)
              };
              _0x40a527++;
            }
          }
        });
        if (_0x40a527 === 0) {
          _showToast("لم يتم العثور على بيانات صالحة في ملف الإكسل. تأكد من أن الأعمدة مرتبة كالتالي: اسم العميل, اسم المستخدم, كلمة المرور.");
          return;
        }
        let _0x392157 = {};
        try {
          const _0x334a9b = await _0x283903.loadCredentials();
          if (_0x334a9b && _0x334a9b.success && _0x334a9b.data) {
            _0x392157 = _0x334a9b.data;
            Object.values(_0x392157).forEach(_migrateCustName);
          }
        } catch (_0x3b8dbe) {}
        if (Object.keys(_0x392157).length > 0) {
          if (!await _customConfirm("لقد وجدت " + Object.keys(_0x392157).length + " حساب محفوظ بالفعل.\nهل تريد دمج وتحديث هذه القائمة بالبيانات الجديدة من الملف؟")) {
            _showToast("تم إلغاء العملية.");
            return;
          }
        }
        const _0x2a9010 = {
          ..._0x392157,
          ..._0x7d5906
        };
        const _0x2c4161 = await _0x283903.saveCredentials(_0x2a9010);
        if (_0x2c4161 && _0x2c4161.success) {
          _showToast("✅ تم تحديث البيانات بنجاح. العدد الإجمالي للحسابات المحفوظة هو " + Object.keys(_0x2a9010).length + ".");
          _0x57fb6c();
        } else {
          throw new Error(_0x2c4161.error || "فشل الحفظ");
        }
      } catch (_0xd5bec3) {
        _showToast("حدث خطأ أثناء معالجة الملف أو حفظ البيانات.");
      }
    };
    _0x590a17.readAsArrayBuffer(_0x41fc6c);
  }
  async function _0x57fb6c() {
    const _0x1eb69f = document.querySelector("#userNameInput");
    const _0xcee2a4 = document.querySelector("#userPwdInput");
    if (!_0x1eb69f || !_0xcee2a4) {
      return;
    }
    let _0x552d52 = {};
    try {
      const _0x41473c = await _0x283903.loadCredentials();
      if (_0x41473c && _0x41473c.success && _0x41473c.data) {
        _0x552d52 = _0x41473c.data;
        Object.values(_0x552d52).forEach(_migrateCustName);
      } else {
        return;
      }
    } catch (_0x558e6f) {
      return;
    }
    const _0x591f6f = new Map(Object.entries(_0x552d52));
    _0x1eb69f.addEventListener("input", _0x1efff5 => {
      const _0x504136 = _0x1efff5.target.value.trim();
      if (_0x591f6f.has(_0x504136)) {
        const _0x4fdc3f = _0x591f6f.get(_0x504136).password;
        if (_0x4fdc3f) {
          _0xcee2a4.value = _0x4fdc3f;
          _0xcee2a4.dispatchEvent(new Event("input", {
            bubbles: true
          }));
        }
      }
    });
    _0xcee2a4.addEventListener("change", async _0x581e2a => {
      const _0x3e6a09 = _0x1eb69f.value.trim();
      const _0x555bdd = _0x581e2a.target.value;
      if (_0x591f6f.has(_0x3e6a09) && _0x591f6f.get(_0x3e6a09).password !== _0x555bdd) {
        setTimeout(async () => {
          if (await _customConfirm("لقد قمت بتغيير كلمة المرور للمستخدم \"" + _0x3e6a09 + "\".\nهل تريد تحديثها في القائمة المحفوظة؟")) {
            try {
              const _0x359661 = _0x591f6f.get(_0x3e6a09);
              _0x359661.password = _0x555bdd;
              const _0x2eea78 = Object.fromEntries(_0x591f6f);
              const _0x214913 = await _0x283903.saveCredentials(_0x2eea78);
              if (_0x214913 && _0x214913.success) {
                _showToast("✅ تم تحديث كلمة المرور بنجاح!");
                _0x591f6f.set(_0x3e6a09, _0x359661);
              } else {
                throw new Error("فشل الحفظ في storage.");
              }
            } catch (_0x1da4db) {
              _showToast("❌ فشل تحديث كلمة المرور.");
            }
          }
        }, 500);
      }
    });
  }
  function _0x10bddf(_0x4f36cc, _0x350cea) {
    if (!_0x4f36cc && _0x350cea) {
      const _0x453faa = /\/Date\((\d+)\)\//.exec(_0x350cea);
      if (_0x453faa) {
        const _0x2daeb9 = new Date(parseInt(_0x453faa[1], 10));
        return String(_0x2daeb9.getMonth() + 1).padStart(2, "0") + "-" + _0x2daeb9.getFullYear();
      }
      const _0x248ceb = new Date(_0x350cea);
      if (!isNaN(_0x248ceb)) {
        return String(_0x248ceb.getMonth() + 1).padStart(2, "0") + "-" + _0x248ceb.getFullYear();
      }
      return "unknown-period";
    }
    const _0x4647e6 = String(_0x4f36cc || "").trim();
    if (/^\d{6}$/.test(_0x4647e6)) {
      return _0x4647e6.slice(4, 6) + "-" + _0x4647e6.slice(0, 4);
    }
    const _0x267997 = _0x4647e6.slice(-6);
    if (/^\d{6}$/.test(_0x267997)) {
      return _0x267997.slice(4, 6) + "-" + _0x267997.slice(0, 4);
    }
    return "unknown-period";
  }
  function _0x188781(_0x4dea4c) {
    if (!_0x4dea4c) {
      return "";
    }
    const _0x250893 = /\/Date\((\d+)\)\//.exec(_0x4dea4c);
    if (!_0x250893) {
      return _0x4dea4c;
    }
    const _0x53102c = new Date(parseInt(_0x250893[1], 10));
    return _0x53102c.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }
  function _0x3659af() {
    ["copy", "cut", "paste", "contextmenu", "selectstart", "dragstart"].forEach(_0x7775f9 => window.addEventListener(_0x7775f9, _0x4ff09b => _0x4ff09b.stopPropagation(), true));
  }
  function _0x2d5273(_0x42e5cd, _0x2a639a) {
    const _0x48332a = location.origin;
    const _0x34b37f = [];
    if (_0x42e5cd) {
      _0x34b37f.push(_0x48332a + "/ETax/ShowDeclarationsAddedValuee/ViewDeclaration?NonTableVATID=" + _0x42e5cd);
      _0x34b37f.push(_0x48332a + "/ETax/ShowDeclarationsAddedValuee/ViewPDF?NonTableVATID=" + _0x42e5cd);
      _0x34b37f.push(_0x48332a + "/ETax/NonTableVatTax2023/PrintData?ID=" + _0x42e5cd);
    }
    if (_0x2a639a) {
      _0x34b37f.push(_0x48332a + "/ETax/ShowDeclarationsAddedValuee/ViewDeclaration?DocumentNum=" + encodeURIComponent(_0x2a639a));
    }
    return [...new Set(_0x34b37f)];
  }
  function _0x29d5ad(_0xee02b3) {
    if (!_0xee02b3 || _0xee02b3.byteLength < 4) {
      return false;
    }
    const _0x7c5b2a = new Uint8Array(_0xee02b3, 0, 4);
    return _0x7c5b2a[0] === 37 && _0x7c5b2a[1] === 80 && _0x7c5b2a[2] === 68 && _0x7c5b2a[3] === 70;
  }
  async function _0x3d4cfc(_0x58e0e9) {
    const _0x4499e6 = _0x2d5273(_0x58e0e9.id, _0x58e0e9.doc);
    for (const _0x2541cd of _0x4499e6) {
      for (let _0x3e10e9 = 1; _0x3e10e9 <= _0x275e29 + 1; _0x3e10e9++) {
        try {
          const _0x33ad29 = new AbortController();
          const _0x19b549 = setTimeout(() => _0x33ad29.abort(), _0x376c17);
          const _0x4c4171 = await fetch(_0x2541cd, {
            method: "GET",
            credentials: "include",
            signal: _0x33ad29.signal
          });
          clearTimeout(_0x19b549);
          const _0x1ebd30 = await _0x4c4171.arrayBuffer();
          if (_0x29d5ad(_0x1ebd30)) {
            return {
              ok: true,
              blob: new Blob([_0x1ebd30], {
                type: "application/pdf"
              })
            };
          }
        } catch (_0x215165) {}
      }
    }
    return {
      ok: false
    };
  }
  function _0x59091e() {
    if (document.getElementById("eta-helper-progress")) {
      return document.getElementById("eta-helper-progress");
    }
    const _0x15045a = document.createElement("div");
    _0x15045a.id = "eta-helper-progress";
    _0x15045a.style.cssText = "position:fixed;bottom:18px;left:50%;transform:translateX(-50%);width:70%;max-width:900px;z-index:2147483647;font-family:Arial,Segoe UI,sans-serif;";
    _0x15045a.innerHTML = "\n      <div style=\"background:#1e1e2e;border:1px solid #313244;padding:10px 12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.4);\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;gap:12px\">\n          <div style=\"font-weight:600;color:#cdd6f4\">MMM — تحميل الإقرارات</div>\n          <button id=\"eta-close-progress\" style=\"padding:6px 10px;border-radius:8px;border:none;background:#313244;color:#cdd6f4;cursor:pointer\">إغلاق</button>\n        </div>\n        <div style=\"margin-top:8px\">\n          <div id=\"eta-progress-text\" style=\"margin-bottom:6px;color:#a6adc8\">جاهز</div>\n          <div style=\"background:#313244;height:18px;border-radius:8px;overflow:hidden\">\n            <div id=\"eta-progress-bar\" style=\"width:0%;height:100%;background:linear-gradient(to right,#6366f1,#8b5cf6);text-align:center;color:#fff;font-size:12px;line-height:18px\">0%</div>\n          </div>\n          <div style=\"margin-top:8px;font-size:13px;color:#a6adc8;display:flex;justify-content:space-between\">\n            <div id=\"eta-stats\"></div><div id=\"eta-current-file\" style=\"opacity:0.85\"></div>\n          </div>\n        </div>\n      </div>";
    document.body.appendChild(_0x15045a);
    _0x15045a.querySelector("#eta-close-progress").addEventListener("click", () => _0x15045a.remove());
    return _0x15045a;
  }
  async function _0x1b237c(_0x3a3042) {
    if (typeof ExcelJS === "undefined") {
      _showToast("مكتبة Excel (ExcelJS) غير محملة. لا يمكن إنشاء الملف.");
      return;
    }
    const _0x317ba7 = new ExcelJS.Workbook();
    _0x317ba7.creator = "ETA Helper Pro";
    _0x317ba7.created = new Date();
    const _0x3eff98 = new Date().toISOString().split("T")[0];
    const _0x3cf609 = _0x317ba7.addWorksheet("ملخص الإقرارات", {
      properties: {
        rightToLeft: true
      },
      views: [{
        state: "frozen",
        ySplit: 1,
        rightToLeft: true
      }]
    });
    _0x3cf609.columns = [{
      header: "الفترة الضريبية",
      key: "period",
      width: 15
    }, {
      header: "اسم الممول",
      key: "name",
      width: 35
    }, {
      header: "نوع الإقرار",
      key: "type",
      width: 25
    }, {
      header: "تاريخ الإرسال",
      key: "date",
      width: 15,
      style: {
        numFmt: "dd/mm/yyyy"
      }
    }, {
      header: "حالة السداد",
      key: "payment",
      width: 15
    }, {
      header: "إجمالي ضريبة القيمة المضافة (مبيعات)",
      key: "salesVat",
      width: 28,
      style: {
        numFmt: "#,##0.00"
      }
    }, {
      header: "إجمالي ضريبة المدخلات (مشتريات)",
      key: "purchaseVat",
      width: 28,
      style: {
        numFmt: "#,##0.00"
      }
    }, {
      header: "إجمالي ضريبة الجدول",
      key: "tableTax",
      width: 20,
      style: {
        numFmt: "#,##0.00"
      }
    }, {
      header: "الرصيد الدائن السابق",
      key: "debt",
      width: 20,
      style: {
        numFmt: "#,##0.00"
      }
    }, {
      header: "صافي الضريبة المستحقة",
      key: "totalTax",
      width: 25,
      style: {
        numFmt: "#,##0.00"
      }
    }];
    _0x3cf609.getRow(1).eachCell(_0x4644f6 => {
      _0x4644f6.font = {
        name: "Arial",
        bold: true,
        size: 12,
        color: {
          argb: "FFFFFFFF"
        }
      };
      _0x4644f6.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF005A9E"
        }
      };
      _0x4644f6.alignment = {
        vertical: "middle",
        horizontal: "center"
      };
      _0x4644f6.border = {
        top: {
          style: "thin"
        },
        left: {
          style: "thin"
        },
        bottom: {
          style: "thin"
        },
        right: {
          style: "thin"
        }
      };
    });
    _0x3a3042.forEach(_0x7b8bb0 => {
      const _0x191b9d = _0x7b8bb0.originalRow;
      let _0x5d3f34 = {
        period: _0x10bddf(_0x191b9d.TaxPeriod, _0x191b9d.SendDate || _0x191b9d.StartTaxperiod),
        name: _0x191b9d.ApplicantName,
        type: _0x191b9d.DeclarationTypeName,
        date: _0x191b9d.SendDate ? new Date(parseInt(_0x191b9d.SendDate.substr(6))) : null,
        payment: _0x191b9d.PaymentStatus
      };
      if (_0x191b9d.hasOwnProperty("SalesVat")) {
        _0x5d3f34.salesVat = _0x191b9d.SalesVat || 0;
        _0x5d3f34.purchaseVat = _0x191b9d.PurchaseVat || 0;
        _0x5d3f34.tableTax = 0;
        _0x5d3f34.debt = _0x191b9d.DebtValue || 0;
        _0x5d3f34.totalTax = _0x191b9d.TotalTaxValue || 0;
      } else if (_0x191b9d.hasOwnProperty("SalesTableVat")) {
        _0x5d3f34.salesVat = _0x191b9d.SalesTableVat || 0;
        _0x5d3f34.purchaseVat = _0x191b9d.PurchaseTableVat || 0;
        _0x5d3f34.tableTax = _0x191b9d.TableTaxVat || 0;
        _0x5d3f34.debt = _0x191b9d.DebtTableValue || 0;
        _0x5d3f34.totalTax = (_0x191b9d.SalesTableVat || 0) - (_0x191b9d.PurchaseTableVat || 0) + (_0x191b9d.TableTaxVat || 0) - (_0x191b9d.DebtTableValue || 0);
      }
      const _0x308332 = _0x3cf609.addRow(_0x5d3f34);
      _0x308332.eachCell({
        includeEmpty: true
      }, _0x1aa037 => {
        _0x1aa037.alignment = {
          vertical: "middle",
          horizontal: "center"
        };
      });
    });
    _0x3cf609.autoFilter = {
      from: "A1",
      to: "J1"
    };
    const _0x5d57ef = _0x317ba7.addWorksheet("التحليل التفصيلي", {
      properties: {
        rightToLeft: true
      },
      views: [{
        state: "frozen",
        ySplit: 1,
        xSplit: 2,
        rightToLeft: true
      }]
    });
    const _0x396b7e = new Set(["الفترة الضريبية", "اسم الممول"]);
    const _0x239318 = _0x3a3042.map(_0xa3e100 => {
      const _0x15dacb = _0xa3e100.originalRow;
      let _0x4225b0 = {
        "الفترة الضريبية": _0x10bddf(_0x15dacb.TaxPeriod, _0x15dacb.SendDate || _0x15dacb.StartTaxperiod),
        "اسم الممول": _0x15dacb.ApplicantName
      };
      const _0x5937c2 = _0x15dacb.SalesDetails || _0x15dacb.SalesTableDetails;
      try {
        JSON.parse(_0x5937c2 || "[]").forEach(_0x146318 => {
          const _0x9bf38d = "مبيعات " + _0x146318.TaxTypeName + " (" + (_0x146318.TaxTypeValue * 100).toFixed(0) + "%)";
          const _0x547bee = [_0x9bf38d + " - قيمة السلع", _0x9bf38d + " - قيمة الخدمات", _0x9bf38d + " - تسويات بالخصم (-)"];
          _0x547bee.forEach(_0x1f21a7 => _0x396b7e.add(_0x1f21a7));
          _0x4225b0[_0x547bee[0]] = _0x146318.ItemValue || _0x146318.TaxContainer || 0;
          _0x4225b0[_0x547bee[1]] = _0x146318.ServiceValue || 0;
          _0x4225b0[_0x547bee[2]] = _0x146318.NegativeAdjustments || 0;
        });
      } catch (_0x321ce2) {}
      const _0x12e8c3 = _0x15dacb.PurchaseDetails || _0x15dacb.PurchaseTableDetails;
      try {
        JSON.parse(_0x12e8c3 || "[]").forEach(_0x53c157 => {
          const _0x3595b3 = "مشتريات " + _0x53c157.PurchaseTypeName + " (" + (_0x53c157.PurchaseTypeValue * 100).toFixed(0) + "%)";
          const _0x1e10f9 = [_0x3595b3 + " - مدخلات محلية", _0x3595b3 + " - مدخلات مستوردة", _0x3595b3 + " - تسويات بالخصم (-)"];
          _0x1e10f9.forEach(_0x49ad73 => _0x396b7e.add(_0x49ad73));
          _0x4225b0[_0x1e10f9[0]] = _0x53c157.Local || 0;
          _0x4225b0[_0x1e10f9[1]] = _0x53c157.Exported || 0;
          _0x4225b0[_0x1e10f9[2]] = _0x53c157.NegativeAdjustments || 0;
        });
      } catch (_0x573c33) {}
      return _0x4225b0;
    });
    _0x5d57ef.columns = Array.from(_0x396b7e).map(_0x2a6f1f => ({
      header: _0x2a6f1f,
      key: _0x2a6f1f,
      width: _0x2a6f1f.includes("اسم الممول") ? 35 : 22,
      style: {
        numFmt: "#,##0.00",
        alignment: {
          vertical: "middle",
          horizontal: "center"
        }
      }
    }));
    _0x5d57ef.getRow(1).eachCell(_0xe75e95 => {
      _0xe75e95.font = {
        bold: true
      };
      _0xe75e95.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFE0E0E0"
        }
      };
    });
    _0x5d57ef.addRows(_0x239318);
    const _0x30b704 = _0x317ba7.addWorksheet("الملخص الإجمالي", {
      properties: {
        rightToLeft: true
      },
      views: [{
        rightToLeft: true
      }]
    });
    _0x30b704.columns = [{
      header: "البيان",
      key: "label",
      width: 40
    }, {
      header: "القيمة",
      key: "value",
      width: 25,
      style: {
        numFmt: "#,##0.00"
      }
    }];
    _0x30b704.getRow(1).eachCell(_0x818efe => {
      _0x818efe.font = {
        bold: true,
        size: 14
      };
      _0x818efe.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFDDDDDD"
        }
      };
    });
    const _0x4a60a6 = _0x3a3042.reduce((_0x27e970, _0x2fdbe6) => _0x27e970 + (_0x2fdbe6.originalRow.SalesVat || _0x2fdbe6.originalRow.SalesTableVat || 0), 0);
    const _0x5f2dd9 = _0x3a3042.reduce((_0x36f4ab, _0x1c1f22) => _0x36f4ab + (_0x1c1f22.originalRow.PurchaseVat || _0x1c1f22.originalRow.PurchaseTableVat || 0), 0);
    const _0x289a89 = _0x3a3042.reduce((_0x19f0de, _0x111127) => _0x19f0de + (_0x111127.originalRow.TableTaxVat || 0), 0);
    const _0x4e4e23 = _0x3a3042.reduce((_0x251b4d, _0x4bde80) => _0x251b4d + (_0x4bde80.originalRow.TotalTaxValue || (_0x4bde80.originalRow.SalesTableVat || 0) - (_0x4bde80.originalRow.PurchaseTableVat || 0) + (_0x4bde80.originalRow.TableTaxVat || 0) - (_0x4bde80.originalRow.DebtTableValue || 0)), 0);
    _0x30b704.addRow({
      label: "إجمالي ضريبة القيمة المضافة (مبيعات) لكل الفترات",
      value: _0x4a60a6
    });
    _0x30b704.addRow({
      label: "إجمالي ضريبة المدخلات (مشتريات) لكل الفترات",
      value: _0x5f2dd9
    });
    _0x30b704.addRow({
      label: "إجمالي ضريبة الجدول لكل الفترات",
      value: _0x289a89
    });
    _0x30b704.addRow({
      label: "صافي الضريبة المستحقة لكل الفترات",
      value: _0x4e4e23
    });
    _0x30b704.addRow({});
    const _0x1b52c2 = _0x30b704.addRow({
      label: "الصافي (مبيعات - مشتريات)",
      value: _0x4a60a6 - _0x5f2dd9
    });
    _0x1b52c2.font = {
      bold: true,
      size: 14,
      color: {
        argb: "FFFF0000"
      }
    };
    _0x1b52c2.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFFFFF00"
      }
    };
    try {
      const _0x20a610 = await _0x317ba7.xlsx.writeBuffer();
      const _0x17e63a = new Blob([_0x20a610], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      saveAs(_0x17e63a, "تحليل_إقرارات_القيمة_المضافة_" + _0x3eff98 + ".xlsx");
    } catch (_0x3fb4f8) {
      _showToast("حدث خطأ أثناء إنشاء ملف الإكسيل. راجع الـ Console لمزيد من التفاصيل.");
    }
  }
  async function _0x1d6342(_0x419f7e) {
    const _0x51876b = _0x59091e();
    const _0xfc21fd = _0x51876b.querySelector("#eta-progress-bar");
    const _0x15dec9 = _0x51876b.querySelector("#eta-progress-text");
    const _0x19d25d = _0x51876b.querySelector("#eta-stats");
    const _0x51a07d = _0x51876b.querySelector("#eta-current-file");
    if (typeof JSZip === "undefined") {
      _showToast("مكتبة JSZip غير محملة. لا يمكن إنشاء الملف.");
      return;
    }
    const _0x4587e4 = new JSZip();
    let _0x440066 = 0;
    let _0x172d56 = 0;
    const _0x1dd657 = [];
    const _0x2ed8c2 = _0x419f7e.length;
    const _0x3c81ca = () => {
      const _0x30add6 = Math.round((_0x440066 + _0x1dd657.length) / _0x2ed8c2 * 100);
      _0xfc21fd.style.width = _0x30add6 + "%";
      _0xfc21fd.textContent = _0x30add6 + "%";
      _0x19d25d.textContent = "تم: " + _0x440066 + " — فشل: " + _0x1dd657.length + " — إجمالي: " + _0x2ed8c2;
    };
    _0x15dec9.textContent = "بدء تحميل ملفات PDF...";
    _0x3c81ca();
    const _0x2aeeb6 = Array.from({
      length: _0x2a3762
    }, async () => {
      while (true) {
        const _0x34e2ae = _0x172d56++;
        if (_0x34e2ae >= _0x2ed8c2) {
          break;
        }
        const _0x7d306c = _0x419f7e[_0x34e2ae];
        _0x51a07d.textContent = "جارٍ: " + _0x7d306c.name + " (" + _0x10bddf(_0x7d306c.taxPeriodRaw, _0x7d306c.originalRow.SendDate) + ")";
        const _0x414516 = await _0x3d4cfc(_0x7d306c);
        if (_0x414516.ok) {
          _0x4587e4.file(_0x1b6b8c(_0x7d306c.name) + "-" + _0x10bddf(_0x7d306c.taxPeriodRaw, _0x7d306c.originalRow.SendDate) + ".pdf", _0x414516.blob);
          _0x440066++;
        } else {
          _0x1dd657.push(_0x7d306c);
        }
        _0x3c81ca();
      }
    });
    await Promise.all(_0x2aeeb6);
    if (_0x440066 === 0) {
      _0x15dec9.textContent = "❌ فشل تحميل جميع الملفات.";
      return;
    }
    _0x15dec9.textContent = "⏳ جاري ضغط الملفات...";
    try {
      const _0x9910e1 = await _0x4587e4.generateAsync({
        type: "blob"
      }, _0xb5a8e5 => {
        _0xfc21fd.style.width = _0xb5a8e5.percent + "%";
        _0xfc21fd.textContent = Math.round(_0xb5a8e5.percent) + "%";
      });
      saveAs(_0x9910e1, "VAT_Declarations_" + new Date().toISOString().split("T")[0] + "_(" + _0x440066 + "_PDFs).zip");
      _0x15dec9.textContent = "✅ تم تنزيل ZIP — نجاح: " + _0x440066 + " / " + _0x2ed8c2;
    } catch (_0x117bbf) {
      ;
      _0x15dec9.textContent = "❌ خطأ أثناء إنشاء ZIP.";
    }
  }
  async function _0x160675() {
    const _0xf71147 = document.getElementById("dateFrom110")?.value || "";
    const _0x281c86 = document.getElementById("dateTo110")?.value || "";
    const _0x12fa81 = ["https://eservice.incometax.gov.eg/ETax/ShowDeclarationsAddedValuee/FillModel110BKendoGrid", "https://eservice.incometax.gov.eg/ETax/ShowDeclarationsAddedValuee/FillModel110AKendoGrid"];
    for (const _0x1bd667 of _0x12fa81) {
      const _0x3f61a4 = {
        page: 1,
        pageSize: 500,
        skip: 0,
        take: 500,
        dateFrom110: _0xf71147,
        dateTo110: _0x281c86,
        filter: null,
        group: null,
        sort: null
      };
      try {
        const _0x10369a = await fetch(_0x1bd667, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify(_0x3f61a4)
        });
        if (!_0x10369a.ok) {
          continue;
        }
        const _0x1815ed = await _0x10369a.json();
        if (_0x1815ed && _0x1815ed.Data && _0x1815ed.Data.length > 0) {
          return _0x1815ed.Data.map(_0x11b22c => ({
            name: _0x11b22c.ApplicantName || _0x11b22c.TaxpayerName || "unknown",
            doc: _0x11b22c.DocumentNum || _0x11b22c.NonTableVATID,
            id: _0x11b22c.NonTableVATID || _0x11b22c.TableVATID,
            taxPeriodRaw: _0x11b22c.TaxPeriod || _0x11b22c.StartTaxperiod || _0x11b22c.SendDate,
            originalRow: _0x11b22c
          }));
        } else {}
      } catch (_0x305857) {}
    }
    throw new Error("فشل جلب البيانات من كل الروابط الممكنة (A و B).");
  }
  async function _0x4249d7(_0x49bf55) {
    try {
      const _0x4d6846 = await _0x160675();
      if (!_0x4d6846 || _0x4d6846.length === 0) {
        _showToast("لم يتم العثور على إقرارات. يرجى التأكد من ظهور نتائج البحث بالكامل قبل الضغط على زر التحميل.");
        return;
      }
      if (_0x49bf55 === "excel") {
        _0x1b237c(_0x4d6846);
      } else {
        _0x1d6342(_0x4d6846);
      }
    } catch (_0x2a4158) {
      _showToast("فشل تحميل الإقرارات: " + _0x2a4158.message);
    }
  }
  function _0xe52479() {
    document.getElementById("eta-format-chooser")?.remove();
    const _0x3e9e41 = document.createElement("div");
    _0x3e9e41.id = "eta-format-chooser";
    _0x3e9e41.innerHTML = "\n      <style>\n        #eta-format-chooser{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;opacity:0;animation:fadeIn 0.3s forwards}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.eta-modal-content{background:#1e1e2e;padding:20px 30px;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.5);text-align:center;width:400px;transform:scale(.95);animation:zoomIn 0.3s forwards;position:relative;border:1px solid #313244}@keyframes zoomIn{from{transform:scale(.95)}to{transform:scale(1)}}.eta-modal-content h3{margin-top:0;margin-bottom:25px;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:600}.eta-modal-options{display:flex;gap:20px;justify-content:center}.eta-modal-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;width:150px;height:120px;cursor:pointer;border:1px solid #313244;border-radius:12px;background:#181825;transition:all .2s ease}.eta-modal-btn:hover{transform:translateY(-5px);box-shadow:0 8px 15px rgba(99,102,241,0.3);border-color:#6366f1}.eta-modal-btn svg{width:48px;height:48px;margin-bottom:10px}.eta-modal-btn span{font-size:15px;font-weight:500;color:#cdd6f4}#eta-close-modal{position:absolute;top:10px;right:10px;background:0 0;border:none;font-size:28px;cursor:pointer;color:#6c7086;line-height:1;transition:color .2s;padding:5px}#eta-close-modal:hover{color:#f38ba8}\n      </style>\n      <div class=\"eta-modal-content\">\n        <button id=\"eta-close-modal\">&times;</button><h3>اختر صيغة تحميل الإقرارات</h3>\n        <div class=\"eta-modal-options\">\n          <div id=\"eta-download-pdf\" class=\"eta-modal-btn\"><svg viewBox=\"0 0 24 24\" fill=\"#f38ba8\"><path d=\"M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm-6.5-2.5H9V8.5h1v1zm4.5 0h-1.5V8.5H15v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z\"/></svg><span>ملفات PDF</span></div>\n          <div id=\"eta-download-excel\" class=\"eta-modal-btn\"><svg viewBox=\"0 0 24 24\" fill=\"#a6e3a1\"><path d=\"M21.17 3.25q.63 0 .9.27.28.28.28.9v15.16q0 .63-.28.9-.27.28-.9.28H2.83q-.63 0-.9-.28-.28-.28-.28-.9V4.42q0-.63.28-.9.27-.28.9-.28h18.34zM12.4 18.5v-2.8l2.1 2.1q.24.24.5.12t.25-.5V8.28q0-.42-.25-.5-.26-.09-.5.12l-2.1 2.1V7.5q0-.3-.23-.44-.22-.13-.47 0l-3.2 1.85q-.25.13-.4.38-.14.25-.14.52v4.5q0 .27.14.52.15.25.4.38l3.2 1.85q.25.13.47 0 .23-.14.23-.44z\"/></svg><span>ملف Excel</span></div>\n        </div>\n      </div>";
    document.body.appendChild(_0x3e9e41);
    const _0x4128f1 = () => _0x3e9e41.remove();
    _0x3e9e41.querySelector("#eta-download-pdf").addEventListener("click", () => {
      _0x4128f1();
      _0x4249d7("pdf");
    });
    _0x3e9e41.querySelector("#eta-download-excel").addEventListener("click", () => {
      _0x4128f1();
      _0x4249d7("excel");
    });
    _0x3e9e41.querySelector("#eta-close-modal").addEventListener("click", _0x4128f1);
    _0x3e9e41.addEventListener("click", _0x3d8281 => {
      if (_0x3d8281.target === _0x3e9e41) {
        _0x4128f1();
      }
    });
  }
  function _0x139d96() {
    const _0x306504 = "https://eservice.incometax.gov.eg/ETax/ShowDeclarationsAddedValuee/ShowAddedValue";
    if (window.location.href.startsWith(_0x306504)) {
      if (document.querySelector("#eta-main-download-btn")) {
        return;
      }
      const _0x1d106b = document.querySelector("#RYNext110");
      if (_0x1d106b?.parentElement) {
        const _0x1b4aa7 = document.createElement("button");
        _0x1b4aa7.id = "eta-main-download-btn";
        _0x1b4aa7.type = "button";
        _0x1b4aa7.textContent = "⬇️ تحميل الإقرارات";
        _0x1b4aa7.title = "تحميل الإقرارات المعروضة (PDF أو Excel)";
        const _0x4791c9 = window.getComputedStyle(_0x1d106b);
        _0x1b4aa7.style.cssText = "height:" + _0x4791c9.height + ";background-color:#6366f1;color:white;font-size:" + _0x4791c9.fontSize + ";border:none;border-radius:10px;cursor:pointer;padding:" + _0x4791c9.padding + ";margin-right:10px;transition:all 0.2s ease;";
        _0x1d106b.parentNode.insertBefore(_0x1b4aa7, _0x1d106b);
        _0x1b4aa7.addEventListener("click", _0x429a0a => {
          _0x429a0a.preventDefault();
          _0x429a0a.stopPropagation();
          _0xe52479();
        });
      }
    } else {
      document.querySelector("#eta-main-download-btn")?.remove();
    }
  }
  const _0x5d8aac = "https://eservice.incometax.gov.eg/ETax/ValueAddedTax/FillInvoicesKendoGrid";
  const _0x2defad = "https://eservice.incometax.gov.eg/ETax/ValueAddedTax/FillInvoiceDetailsKendoGrid";
  const _0x4b6552 = 100;
  const _0x2bf864 = {
    SALES: "2",
    PURCHASES: "1"
  };
  function _0x1649f8(_0x3c96d6) {
    return new Promise(_0x22d3c4 => setTimeout(_0x22d3c4, _0x3c96d6));
  }
  function _0x331be9(_0x5079cb) {
    if (!_0x5079cb) {
      return "";
    }
    const _0x24f2cb = parseInt(_0x5079cb.substr(6));
    if (isNaN(_0x24f2cb)) {
      return "";
    }
    const _0x1d6042 = new Date(_0x24f2cb);
    return String(_0x1d6042.getDate()).padStart(2, "0") + "/" + String(_0x1d6042.getMonth() + 1).padStart(2, "0") + "/" + _0x1d6042.getFullYear();
  }
  function _0x4e2ae4(_0x44d27c) {
    switch (String(_0x44d27c)) {
      case "1":
      case "2":
        return "فاتورة";
      case "3":
        return "إشعار خصم";
      case "4":
        return "إشعار إضافة";
      default:
        return "نوع غير معروف (" + _0x44d27c + ")";
    }
  }
  async function _0x27785a(_0x26cc01, _0x53d4dc, _0xd10cc3) {
    const _0x4d1da3 = new URLSearchParams({
      sort: "",
      group: "",
      filter: "",
      InvoiceNumber: "",
      page: _0x26cc01,
      pageSize: _0x4b6552,
      VATFileType: _0x53d4dc,
      Date: _0xd10cc3
    });
    const _0x49a21d = 3;
    for (let _0x14e4f6 = 1; _0x14e4f6 <= _0x49a21d; _0x14e4f6++) {
      try {
        if (_0x14e4f6 > 1) {
          await _0x1649f8(_0x14e4f6 * 1000);
        }
        const _0x23b511 = await fetch(_0x5d8aac, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: _0x4d1da3.toString()
        });
        if (_0x23b511.status === 429 && _0x14e4f6 < _0x49a21d) {
          await _0x1649f8(_0x14e4f6 * 2000);
          continue;
        }
        if (!_0x23b511.ok) {
          throw new Error("فشل طلب الفواتير للصفحة " + _0x26cc01 + ". الحالة: " + _0x23b511.status);
        }
        return _0x23b511.json();
      } catch (_0x40ff2d) {
        if (_0x14e4f6 === _0x49a21d) {
          throw _0x40ff2d;
        }
      }
    }
  }
  async function _0x1fdc13(_0x330516, _0x245a1f, _0x508f18, _0x2e1228) {
    const _0x4690eb = String(_0x330516).padStart(2, "0") + "/" + _0x245a1f;
    _0x2e1228("--- بدء تحميل شهر: " + _0x4690eb + " ---", 0);
    const _0x1a68c = await _0x27785a(1, _0x508f18, _0x4690eb);
    if (!_0x1a68c || !_0x1a68c.Data || _0x1a68c.Data.length === 0) {
      _0x2e1228("لا توجد فواتير في شهر " + _0x4690eb + ".", 0);
      return [];
    }
    _0x1a68c.Data.forEach(_0x24f026 => {
      _0x24f026.VATFileType = _0x508f18;
    });
    let _0x40f49e = _0x1a68c.Data;
    const _0xbfc91d = _0x1a68c.Total;
    const _0x14e918 = Math.ceil(_0xbfc91d / _0x4b6552);
    _0x2e1228("شهر " + _0x4690eb + ": تم العثور على " + _0xbfc91d + " فاتورة (" + _0x14e918 + " صفحة).", 1 / _0x14e918 * 100);
    if (_0x14e918 > 1) {
      for (let _0x11370f = 2; _0x11370f <= _0x14e918; _0x11370f++) {
        if (_0x5394e7) {
          break;
        }
        await _0x1649f8(500);
        _0x2e1228("   -> جاري تحميل الصفحة " + _0x11370f + " من " + _0x14e918 + "...", _0x11370f / _0x14e918 * 100);
        const _0x18881c = await _0x27785a(_0x11370f, _0x508f18, _0x4690eb);
        if (_0x18881c && _0x18881c.Data) {
          _0x18881c.Data.forEach(_0x27b61e => {
            _0x27b61e.VATFileType = _0x508f18;
          });
          _0x40f49e = _0x40f49e.concat(_0x18881c.Data);
        }
      }
    }
    _0x2e1228("اكتمل تحميل شهر " + _0x4690eb + ". الإجمالي: " + _0x40f49e.length + " فاتورة.", 100);
    return _0x40f49e;
  }
  async function _0x5acc55(_0x469683, _0x2b097b, _0x8a0e6f = 3) {
    const _0x23fe27 = new URLSearchParams({
      InvoiceID: _0x469683.InvoiceID,
      sort: "",
      page: "1",
      pageSize: "50",
      group: "",
      filter: "",
      VATFileType: _0x2b097b
    });
    for (let _0x55feba = 1; _0x55feba <= _0x8a0e6f; _0x55feba++) {
      try {
        const _0x26adbb = await fetch(_0x2defad, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: _0x23fe27.toString()
        });
        if (!_0x26adbb.ok) {
          if (_0x26adbb.status === 429 && _0x55feba < _0x8a0e6f) {
            await _0x1649f8(_0x55feba * 1000);
            continue;
          }
          throw new Error("فشل جلب تفاصيل الفاتورة " + _0x469683.InvoiceNumber + ". الحالة: " + _0x26adbb.status);
        }
        const _0x25fbe8 = await _0x26adbb.json();
        return (_0x25fbe8.Data || []).map(_0xd9b843 => ({
          ..._0xd9b843,
          VATFileType: _0x2b097b,
          ParentInvoiceNumber: _0x469683.InvoiceNumber,
          ParentInvoiceDate: new Date(parseInt(_0x469683.InvoiceDate.substr(6))),
          ParentCustomerName: _0x469683.CustomerName,
          ParentDocumentType: _0x4e2ae4(_0x469683.InvoiceType)
        }));
      } catch (_0x5af8a5) {
        if (_0x55feba === _0x8a0e6f) {
          return [];
        }
      }
    }
    return [];
  }
  async function _0x9f542c(_0x4d4665, _0x51da47, _0x696cce, _0xb541bc) {
    if (typeof ExcelJS === "undefined") {
      _showToast("مكتبة Excel (ExcelJS) غير محملة. لا يمكن إنشاء الملف.");
      return;
    }
    const _0x413f6f = new ExcelJS.Workbook();
    _0x413f6f.creator = "ETA Helper Pro";
    _0x413f6f.created = new Date();
    const _0x489852 = _0xb541bc === "" ? "الكل" : _0xb541bc === _0x2bf864.SALES ? "المبيعات" : "المشتريات";
    const _0x26b0e9 = _0x413f6f.addWorksheet("ملخص الفواتير", {
      properties: {
        rightToLeft: true
      },
      views: [{
        rightToLeft: true,
        state: "frozen",
        ySplit: 1
      }]
    });
    _0x26b0e9.columns = [{
      header: "نوع الحركة",
      key: "movementType",
      width: 15
    }, {
      header: "نوع المستند",
      key: "docType",
      width: 15
    }, {
      header: "رقم الفاتورة",
      key: "invNum",
      width: 20
    }, {
      header: "تاريخ الفاتورة",
      key: "invDate",
      width: 15,
      style: {
        numFmt: "dd/mm/yyyy"
      }
    }, {
      header: "اسم العميل/المورد",
      key: "custName",
      width: 35
    }, {
      header: "رقم التسجيل",
      key: "taxId",
      width: 20
    }, {
      header: "صافي المبلغ",
      key: "net",
      width: 15,
      style: {
        numFmt: "#,##0.00"
      }
    }, {
      header: "قيمة الضريبة",
      key: "tax",
      width: 15,
      style: {
        numFmt: "#,##0.00"
      }
    }, {
      header: "الإجمالي",
      key: "total",
      width: 15,
      style: {
        numFmt: "#,##0.00"
      }
    }];
    _0x26b0e9.getRow(1).eachCell(_0x4e8666 => {
      _0x4e8666.font = {
        name: "Arial",
        bold: true,
        size: 12,
        color: {
          argb: "FFFFFFFF"
        }
      };
      _0x4e8666.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF4472C4"
        }
      };
      _0x4e8666.alignment = {
        vertical: "middle",
        horizontal: "center"
      };
    });
    _0x26b0e9.autoFilter = {
      from: "A1",
      to: "I1"
    };
    _0x4d4665.forEach(_0x5a336f => {
      _0x26b0e9.addRow({
        movementType: _0x5a336f.VATFileType === _0x2bf864.SALES ? "مبيعات" : "مشتريات",
        docType: _0x4e2ae4(_0x5a336f.InvoiceType),
        invNum: _0x5a336f.InvoiceNumber,
        invDate: new Date(parseInt(_0x5a336f.InvoiceDate.substr(6))),
        custName: _0x5a336f.CustomerName,
        taxId: _0x5a336f.CustomerUniqueTaxId ? _0x5a336f.CustomerUniqueTaxId.trim() : "",
        net: _0x5a336f.InvoiceTotalNet,
        tax: _0x5a336f.InvoiceTotalTax,
        total: _0x5a336f.InvoiceTotalMoney
      });
    });
    if (_0x51da47 && _0x51da47.length > 0) {
      const _0x4ba1f1 = _0x413f6f.addWorksheet("تفاصيل الأصناف", {
        views: [{
          rightToLeft: true,
          state: "frozen",
          ySplit: 1
        }]
      });
      _0x4ba1f1.columns = [{
        header: "نوع الحركة",
        key: "movementType",
        width: 15
      }, {
        header: "رقم الفاتورة الأم",
        key: "parentInvNum",
        width: 20
      }, {
        header: "تاريخ الفاتورة الأم",
        key: "parentInvDate",
        width: 15,
        style: {
          numFmt: "dd/mm/yyyy"
        }
      }, {
        header: "اسم العميل/المورد",
        key: "parentCustName",
        width: 35
      }, {
        header: "وصف الصنف",
        key: "prodName",
        width: 40
      }, {
        header: "الكمية",
        key: "qty",
        width: 12,
        style: {
          numFmt: "#,##0.00"
        }
      }, {
        header: "سعر الوحدة",
        key: "unitPrice",
        width: 15,
        style: {
          numFmt: "#,##0.00"
        }
      }, {
        header: "صافي الصنف",
        key: "net",
        width: 15,
        style: {
          numFmt: "#,##0.00"
        }
      }, {
        header: "ضريبة الصنف",
        key: "tax",
        width: 15,
        style: {
          numFmt: "#,##0.00"
        }
      }, {
        header: "إجمالي الصنف",
        key: "total",
        width: 15,
        style: {
          numFmt: "#,##0.00"
        }
      }];
      _0x4ba1f1.getRow(1).eachCell(_0x5b58d7 => {
        _0x5b58d7.font = {
          name: "Arial",
          bold: true,
          size: 12,
          color: {
            argb: "FFFFFFFF"
          }
        };
        _0x5b58d7.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FF4472C4"
          }
        };
        _0x5b58d7.alignment = {
          vertical: "middle",
          horizontal: "center"
        };
      });
      _0x4ba1f1.autoFilter = {
        from: "A1",
        to: "J1"
      };
      _0x51da47.forEach(_0x2dcb57 => {
        _0x4ba1f1.addRow({
          movementType: _0x2dcb57.VATFileType === _0x2bf864.SALES ? "مبيعات" : "مشتريات",
          parentInvNum: _0x2dcb57.ParentInvoiceNumber,
          parentInvDate: _0x2dcb57.ParentInvoiceDate,
          parentCustName: _0x2dcb57.ParentCustomerName,
          prodName: _0x2dcb57.ProductName,
          qty: _0x2dcb57.ProductQuantity,
          unitPrice: _0x2dcb57.ProductUnitPrice,
          net: _0x2dcb57.ProductTotalNet,
          tax: _0x2dcb57.ProductTotalTaxValue,
          total: _0x2dcb57.ProductTotalMoney
        });
      });
    }
    const _0x203728 = await _0x413f6f.xlsx.writeBuffer();
    const _0x4fdfe5 = new Blob([_0x203728], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(_0x4fdfe5, "فواتير_" + _0x489852 + "_" + _0x696cce + ".xlsx");
  }
  function _0x43c11c() {
    if (document.getElementById("fawateer-main-btn")) {
      return;
    }
    const _0x25b26d = document.getElementById("BtnSearch");
    if (!_0x25b26d) {
      return;
    }
    const _0x59153e = document.createElement("input");
    _0x59153e.type = "button";
    _0x59153e.value = "📥 تحميل الفواتير (Excel)";
    _0x59153e.id = "fawateer-main-btn";
    _0x59153e.className = "submit btn btn-primary";
    _0x59153e.style.cssText = "margin-right: 10px; background-color: #6366f1; color: #ffffff; border: none; border-radius: 10px; transition: all 0.2s ease;";
    _0x25b26d.parentNode.insertBefore(_0x59153e, _0x25b26d);
    _0x59153e.addEventListener("click", _0x1162a9);
  }
  function _0x1162a9() {
    const _0x1896f7 = document.getElementById("fawateer-modal-overlay");
    if (_0x1896f7) {
      _0x1896f7.remove();
    }
    const _0x125423 = "\n        <div id=\"fawateer-modal-overlay\" style=\"display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7);backdrop-filter:blur(4px); z-index:10000; justify-content:center; align-items:center; direction:rtl; font-family:'Segoe UI', Tahoma, sans-serif; animation: fadeIn 0.3s;\">\n            <div style=\"background:#1e1e2e; padding:0; border-radius:16px; width:550px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid #313244; transform: scale(0.95); animation: zoomIn 0.3s forwards;\">\n                <div style=\"padding: 20px 30px; border-bottom: 1px solid #313244; background-color:#181825; border-top-left-radius:16px; border-top-right-radius:16px;\">\n                    <h3 style=\"margin:0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size:22px;\">خيارات تحميل الفواتير</h3>\n                </div>\n                <div style=\"padding: 30px; display:flex; flex-direction:column; gap: 20px; color: #cdd6f4;\">\n                    <div class=\"fawateer-step\">\n                        <label><b>1.</b> اختر المصدر:</label>\n                        <select id=\"fawateer-source-select\" class=\"fawateer-input\">\n                            <option value=\"current\">الفواتير المعروضة حالياً</option>\n                            <option value=\"period\">فترة زمنية محددة</option>\n                        </select>\n                    </div>\n                    <div id=\"fawateer-period-options\" style=\"display:none;\">\n                        <div class=\"fawateer-step\">\n                            <label><b>2.</b> اختر نوع الفواتير:</label>\n                            <select id=\"fawateer-type-select\" class=\"fawateer-input\">\n                                <option value=\"\">الكل (مبيعات ومشتريات)</option>\n                                <option value=\"" + _0x2bf864.SALES + "\">مبيعات فقط</option>\n                                <option value=\"" + _0x2bf864.PURCHASES + "\">مشتريات فقط</option>\n                            </select>\n                        </div>\n                        <div class=\"fawateer-step\">\n                            <label><b>3.</b> اختر النطاق الزمني:</label>\n                            <select id=\"fawateer-period-select\" class=\"fawateer-input\">\n                                <option value=\"year\">سنة كاملة</option>\n                                <option value=\"month\">شهر معين</option>\n                            </select>\n                            <div style=\"display:flex; gap:10px; margin-top:10px;\">\n                                <select id=\"fawateer-year-select\" class=\"fawateer-input\">\n                                    " + Array.from({
      length: 10
    }, (_0x271170, _0x37999e) => new Date().getFullYear() - _0x37999e).map(_0x2070cf => "<option value=\"" + _0x2070cf + "\">" + _0x2070cf + "</option>").join("") + "\n                                </select>\n                                <select id=\"fawateer-month-select\" class=\"fawateer-input\" style=\"display:none;\">\n                                     " + Array.from({
      length: 12
    }, (_0x6c9876, _0x511769) => _0x511769 + 1).map(_0xa6853e => "<option value=\"" + _0xa6853e + "\">شهر " + _0xa6853e + "</option>").join("") + "\n                                </select>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"fawateer-step\">\n                        <label><b>4.</b> اختر مستوى التفاصيل:</label>\n                        <select id=\"fawateer-details-select\" class=\"fawateer-input\">\n                            <option value=\"summary\">إجمالي الفواتير فقط (أسرع)</option>\n                            <option value=\"full\">إجمالي + تفاصيل الأصناف (أبطأ)</option>\n                        </select>\n                    </div>\n                </div>\n                <div style=\"padding: 20px 30px; background-color: #181825; border-top: 1px solid #313244; display:flex; justify-content:space-between; align-items:center;\">\n                    <button id=\"fawateer-modal-close\" style=\"background: #313244; color:#cdd6f4; border:none; padding: 10px 25px; border-radius: 10px; cursor:pointer; font-size:15px;\">إغلاق</button>\n                    <button id=\"fawateer-start-btn\" style=\"background: linear-gradient(135deg, #6366f1, #8b5cf6); color:white; border:none; padding: 12px 35px; border-radius: 10px; cursor:pointer; font-size:16px; font-weight:bold;\">🚀 بدء التحميل</button>\n                </div>\n            </div>\n        </div>\n        <style>\n            .fawateer-step { display:flex; flex-direction:column; gap:8px; margin-bottom: 15px; }\n            .fawateer-step label { font-size:16px; color:#a6adc8; }\n            .fawateer-input { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #313244; border-radius:8px; font-size:15px; background: #181825; color: #cdd6f4; }\n        </style>\n    ";
    document.body.insertAdjacentHTML("beforeend", _0x125423);
    const _0x1a1b85 = document.getElementById("fawateer-source-select");
    const _0x2e0de3 = document.getElementById("fawateer-period-options");
    const _0x231981 = document.getElementById("fawateer-period-select");
    const _0x17dd36 = document.getElementById("fawateer-month-select");
    _0x1a1b85.addEventListener("change", () => {
      _0x2e0de3.style.display = _0x1a1b85.value === "period" ? "block" : "none";
    });
    _0x231981.addEventListener("change", () => {
      _0x17dd36.style.display = _0x231981.value === "month" ? "block" : "none";
    });
    _0x231981.dispatchEvent(new Event("change"));
    document.getElementById("fawateer-start-btn").addEventListener("click", () => {
      const _0x16da21 = {
        periodMode: _0x1a1b85.value,
        vatFileType: document.getElementById("fawateer-type-select").value,
        timeRange: document.getElementById("fawateer-period-select").value,
        year: document.getElementById("fawateer-year-select").value,
        month: document.getElementById("fawateer-month-select").value,
        detailsMode: document.getElementById("fawateer-details-select").value
      };
      _0x3ebc6a(_0x16da21);
    });
    const _0x41e8ed = document.getElementById("fawateer-modal-overlay");
    const _0x52340d = () => _0x41e8ed.remove();
    document.getElementById("fawateer-modal-close").addEventListener("click", _0x52340d);
    _0x41e8ed.addEventListener("click", _0x585056 => {
      if (_0x585056.target === _0x41e8ed) {
        _0x52340d();
      }
    });
  }
  function _0x383437() {
    const _0x259f51 = document.getElementById("fawateer-initial-modal");
    if (_0x259f51) {
      _0x259f51.remove();
    }
    const _0xdec348 = "\n        <div id=\"fawateer-initial-modal\" style=\"display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7);backdrop-filter:blur(4px); z-index:10000; justify-content:center; align-items:center; direction:rtl; font-family:'Segoe UI', Tahoma, sans-serif; animation: fadeIn 0.3s;\">\n            <div style=\"background:#1e1e2e; padding:0; border-radius:16px; width:500px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); text-align:center; border: 1px solid #313244; transform: scale(0.95); animation: zoomIn 0.3s forwards;\">\n                <div style=\"padding: 20px 30px; border-bottom: 1px solid #313244;\">\n                    <h3 style=\"margin:0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size:22px;\">تحميل الفواتير إكسل</h3>\n                </div>\n                <div style=\"padding: 30px;\">\n                    <p style=\"font-size:16px; color:#a6adc8; margin-top:0; margin-bottom:25px;\">اختر طريقة التحميل التي تناسبك:</p>\n                    <div style=\"display:flex; flex-direction:column; gap:15px;\">\n                        <button id=\"fawateer-current-btn\" class=\"fawateer-choice-btn\">\n                            <span style=\"font-size:24px; margin-left:10px;\">⚡</span>\n                            <span>تحميل الفواتير المعروضة حالياً</span>\n                        </button>\n                        <button id=\"fawateer-detailed-btn\" class=\"fawateer-choice-btn\">\n                            <span style=\"font-size:24px; margin-left:10px;\">📅</span>\n                            <span>تحميل مفصل (حسب الفترة)</span>\n                        </button>\n                    </div>\n                </div>\n                <div style=\"padding: 15px; background-color: #181825; border-top: 1px solid #313244;\">\n                     <button id=\"fawateer-initial-close\" style=\"background: #313244; color:#cdd6f4; border:none; padding: 10px 25px; border-radius: 10px; cursor:pointer; font-size:15px;\">إغلاق</button>\n                </div>\n            </div>\n        </div>\n        <style>\n            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n            @keyframes zoomIn { from { transform: scale(0.95); } to { transform: scale(1); } }\n            .fawateer-choice-btn { \n                display:flex; align-items:center; justify-content:center;\n                padding: 18px; font-size: 17px; font-weight:bold;\n                background-color: #181825; color: #89b4fa; \n                border: 2px solid #313244; border-radius: 10px; cursor: pointer;\n                transition: all 0.2s ease;\n            }\n            .fawateer-choice-btn:hover {\n                background-color: #6366f1; color: white;\n                transform: translateY(-3px); box-shadow: 0 4px 15px rgba(99,102,241,0.3);\n            }\n        </style>\n    ";
    document.body.insertAdjacentHTML("beforeend", _0xdec348);
    const _0x107d00 = document.getElementById("fawateer-initial-modal");
    document.getElementById("fawateer-current-btn").addEventListener("click", () => {
      _0x107d00.remove();
      const _0x175b36 = document.querySelector("input[name=\"Date\"]");
      if (!_0x175b36 || !_0x175b36.value) {
        _showToast("يرجى اختيار فترة زمنية في الصفحة أولاً لتحميل الفواتير المعروضة.");
        return;
      }
      const _0x16b724 = {
        periodMode: "current",
        detailsMode: "full"
      };
      _0x3ebc6a(_0x16b724);
    });
    document.getElementById("fawateer-detailed-btn").addEventListener("click", () => {
      _0x107d00.remove();
      _0x3f1a69();
    });
    const _0x5cd94f = () => _0x107d00.remove();
    document.getElementById("fawateer-initial-close").addEventListener("click", _0x5cd94f);
    _0x107d00.addEventListener("click", _0xf1adf2 => {
      if (_0xf1adf2.target === _0x107d00) {
        _0x5cd94f();
      }
    });
  }
  function _0x3f1a69() {
    const _0x4a46ab = document.getElementById("fawateer-modal-overlay");
    if (_0x4a46ab) {
      _0x4a46ab.remove();
    }
    const _0x1b0544 = "\n        <div id=\"fawateer-modal-overlay\" style=\"display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7);backdrop-filter:blur(4px); z-index:10000; justify-content:center; align-items:center; direction:rtl; font-family:'Segoe UI', Tahoma, sans-serif; animation: fadeIn 0.3s;\">\n            <div style=\"background:#1e1e2e; padding:0; border-radius:16px; width:550px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid #313244; transform: scale(0.95); animation: zoomIn 0.3s forwards; display:flex; flex-direction:column; max-height:90vh;\">\n                <div style=\"padding: 20px 30px; border-bottom: 1px solid #313244; background-color:#181825; border-top-left-radius:16px; border-top-right-radius:16px; flex-shrink:0;\">\n                    <h3 style=\"margin:0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size:22px;\">خيارات التحميل المفصل</h3>\n                </div>\n                \n                <div id=\"fawateer-options-content\" style=\"padding: 30px; display:flex; flex-direction:column; gap: 20px; color: #cdd6f4; overflow-y:auto;\">\n                    <div class=\"fawateer-step\">\n                        <label><b>1.</b> اختر نوع الفواتير:</label>\n                        <select id=\"fawateer-type-select\" class=\"fawateer-input\">\n                            <option value=\"\">الكل (مبيعات ومشتريات)</option>\n                            <option value=\"" + _0x2bf864.SALES + "\">مبيعات فقط</option>\n                            <option value=\"" + _0x2bf864.PURCHASES + "\">مشتريات فقط</option>\n                        </select>\n                    </div>\n                    <div class=\"fawateer-step\">\n                        <label><b>2.</b> اختر النطاق الزمني:</label>\n                        <select id=\"fawateer-period-select\" class=\"fawateer-input\">\n                            <option value=\"year\">سنة كاملة</option>\n                            <option value=\"month\">شهر معين</option>\n                        </select>\n                        <div style=\"display:flex; gap:10px; margin-top:10px;\">\n                            <select id=\"fawateer-year-select\" class=\"fawateer-input\">\n                                " + Array.from({
      length: 10
    }, (_0x32b4f8, _0x46483a) => new Date().getFullYear() - _0x46483a).map(_0x4964c8 => "<option value=\"" + _0x4964c8 + "\">" + _0x4964c8 + "</option>").join("") + "\n                            </select>\n                            <select id=\"fawateer-month-select\" class=\"fawateer-input\" style=\"display:none;\">\n                                 " + Array.from({
      length: 12
    }, (_0x2a927a, _0x5e89ff) => _0x5e89ff + 1).map(_0xae2dc0 => "<option value=\"" + _0xae2dc0 + "\">شهر " + _0xae2dc0 + "</option>").join("") + "\n                            </select>\n                        </div>\n                    </div>\n                    <div class=\"fawateer-step\">\n                        <label><b>3.</b> اختر مستوى التفاصيل:</label>\n                        <select id=\"fawateer-details-select\" class=\"fawateer-input\">\n                            <option value=\"summary\">إجمالي الفواتير فقط (أسرع)</option>\n                            <option value=\"full\">إجمالي + تفاصيل الأصناف (أبطأ)</option>\n                        </select>\n                    </div>\n                </div>\n\n                <!-- *** حاوية شريط التقدم الجديدة المدمجة *** -->\n                <div id=\"fawateer-progress-container-inline\" style=\"display:none; padding: 20px 30px; flex-shrink:0;\">\n                    <p id=\"fawateer-progress-text-inline\" style=\"margin:0 0 10px 0; font-weight:bold; font-size:15px; color: #cdd6f4;\">جاري التهيئة...</p>\n                    <div style=\"background-color:#313244; border-radius:8px; overflow:hidden; height:14px;\">\n                        <div id=\"fawateer-progress-bar-inline\" style=\"width:0%; height:100%; background-image: linear-gradient(to right, #6366f1, #8b5cf6); transition: width 0.4s ease-in-out;\"></div>\n                    </div>\n                </div>\n                <!-- ****************************************** -->\n\n                <div id=\"fawateer-footer-buttons\" style=\"padding: 20px 30px; background-color: #181825; border-top: 1px solid #313244; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;\">\n                    <button id=\"fawateer-modal-close\" style=\"background: #313244; color:#cdd6f4; border:none; padding: 10px 25px; border-radius: 10px; cursor:pointer; font-size:15px;\">إغلاق</button>\n                    <button id=\"fawateer-start-btn\" style=\"background: linear-gradient(135deg, #6366f1, #8b5cf6); color:white; border:none; padding: 12px 35px; border-radius: 10px; cursor:pointer; font-size:16px; font-weight:bold;\">🚀 بدء التحميل</button>\n                    <button id=\"fawateer-stop-btn\" style=\"display:none; background: linear-gradient(135deg, #f38ba8, #eba0ac); color:#1e1e2e; border:none; padding: 12px 35px; border-radius: 10px; cursor:pointer; font-size:16px; font-weight:bold;\">✋ إيقاف والتصدير</button>\n                </div>\n            </div>\n        </div>\n        <style>\n            .fawateer-step { display:flex; flex-direction:column; gap:8px; }\n            .fawateer-step label { font-size:16px; color:#a6adc8; }\n            .fawateer-input { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #313244; border-radius:8px; font-size:15px; background: #181825; color: #cdd6f4; }\n        </style>\n    ";
    document.body.insertAdjacentHTML("beforeend", _0x1b0544);
    const _0x5bfdd1 = document.getElementById("fawateer-period-select");
    const _0x11adfe = document.getElementById("fawateer-month-select");
    _0x5bfdd1.addEventListener("change", () => {
      _0x11adfe.style.display = _0x5bfdd1.value === "month" ? "block" : "none";
    });
    _0x5bfdd1.dispatchEvent(new Event("change"));
    document.getElementById("fawateer-start-btn").addEventListener("click", () => {
      const _0x24f8bd = {
        vatFileType: document.getElementById("fawateer-type-select").value,
        periodMode: document.getElementById("fawateer-period-select").value,
        year: document.getElementById("fawateer-year-select").value,
        month: document.getElementById("fawateer-month-select").value,
        detailsMode: document.getElementById("fawateer-details-select").value
      };
      _0x3ebc6a(_0x24f8bd);
    });
    const _0x5c116a = document.getElementById("fawateer-modal-overlay");
    const _0x462396 = () => _0x5c116a.remove();
    document.getElementById("fawateer-modal-close").addEventListener("click", _0x462396);
    _0x5c116a.addEventListener("click", _0x49f7a9 => {
      if (_0x49f7a9.target === _0x5c116a) {
        _0x462396();
      }
    });
  }
  let _0x5394e7 = false;
  async function _0x3ebc6a(_0x95ae5e) {
    _0x3e6152();
    document.getElementById("fawateer-modal-overlay")?.remove();
    const _0x2b1ea5 = document.getElementById("fawateer-progress-widget");
    const _0x4e08ee = document.getElementById("fawateer-progress-text");
    const _0x31291d = document.getElementById("fawateer-progress-bar");
    const _0x3f163b = document.getElementById("fawateer-status-icon");
    const _0x1db59a = document.getElementById("fawateer-stop-btn-widget");
    _0x2b1ea5.style.display = "block";
    _0x5394e7 = false;
    _0x1db59a.onclick = () => {
      _0x5394e7 = true;
      _0x4e08ee.textContent = "... جاري الإيقاف، سيتم تصدير ما تم تحميله فوراً ...";
    };
    const _0x53a4d0 = (_0x1db643, _0x67fce0) => {
      if (_0x5394e7) {
        return;
      }
      _0x4e08ee.textContent = _0x1db643;
      if (_0x67fce0 !== undefined) {
        _0x31291d.style.width = Math.round(_0x67fce0) + "%";
      }
    };
    let _0x2ef81c = [];
    let _0x534309 = [];
    let _0x4ea5b4 = "الفترة_المحددة";
    let _0x3f9347 = _0x95ae5e.vatFileType;
    try {
      if (_0x95ae5e.periodMode === "current") {
        _0x53a4d0("جاري قراءة الفلتر من أزرار الراديو...", 5);
        const _0x5d9431 = document.querySelector("input[name=\"VATFileType\"]:checked");
        if (!_0x5d9431) {
          throw new Error("فشل حاسم: لم يتم العثور على زر راديو محدد.");
        }
        _0x3f9347 = _0x5d9431.value;
        const _0x255d34 = _0x3f9347 === "2" ? "المبيعات" : "المشتريات";
        const _0x1eb277 = document.querySelector("input[name=\"Date\"]");
        if (!_0x1eb277 || !_0x1eb277.value) {
          throw new Error("لم يتم العثور على حقل التاريخ.");
        }
        const _0x3b15ed = _0x1eb277.value;
        _0x4ea5b4 = "المعروض_حاليا_" + _0x3b15ed.replace("/", "-");
        _0x53a4d0("جاري تحميل كل صفحات " + _0x255d34 + " لفترة: " + _0x3b15ed, 10);
        const _0x4c529f = await _0x27785a(1, _0x3f9347, _0x3b15ed);
        if (!_0x4c529f || !_0x4c529f.Data || !_0x4c529f.Data.length) {
          throw new Error("لم يتم العثور على فواتير (" + _0x255d34 + ") للفترة المحددة.");
        }
        _0x4c529f.Data.forEach(_0x5d9bc9 => _0x5d9bc9.VATFileType = _0x3f9347);
        _0x2ef81c = _0x4c529f.Data;
        const _0x25dd7e = _0x4c529f.Total;
        const _0x9ec6cf = Math.ceil(_0x25dd7e / _0x4b6552);
        _0x53a4d0("تم العثور على " + _0x25dd7e + " فاتورة في " + _0x9ec6cf + " صفحات.", 1 / _0x9ec6cf * 100);
        if (_0x9ec6cf > 1) {
          for (let _0x19c298 = 2; _0x19c298 <= _0x9ec6cf; _0x19c298++) {
            if (_0x5394e7) {
              break;
            }
            _0x53a4d0("جاري تحميل الصفحة " + _0x19c298 + " من " + _0x9ec6cf + "...", _0x19c298 / _0x9ec6cf * 100);
            const _0x551421 = await _0x27785a(_0x19c298, _0x3f9347, _0x3b15ed);
            if (_0x551421 && _0x551421.Data) {
              _0x551421.Data.forEach(_0x3014c3 => _0x3014c3.VATFileType = _0x3f9347);
              _0x2ef81c = _0x2ef81c.concat(_0x551421.Data);
            }
            await _0x1649f8(200);
          }
        }
      } else {
        const _0x1a91e9 = _0x3f9347 === "" ? [_0x2bf864.SALES, _0x2bf864.PURCHASES] : [_0x3f9347];
        const _0x58971e = _0x95ae5e.year;
        const _0x2d12b0 = _0x95ae5e.timeRange === "year" ? Array.from({
          length: 12
        }, (_0x47cc3c, _0xbf3d10) => _0xbf3d10 + 1) : [parseInt(_0x95ae5e.month)];
        _0x4ea5b4 = _0x95ae5e.timeRange === "year" ? "عام_" + _0x58971e : _0x95ae5e.month + "-" + _0x58971e;
        const _0x273493 = _0x2d12b0.length * _0x1a91e9.length;
        let _0x1221e4 = 0;
        for (const _0x5b219b of _0x2d12b0) {
          if (_0x5394e7) {
            break;
          }
          for (const _0x4241f4 of _0x1a91e9) {
            if (_0x5394e7) {
              break;
            }
            const _0x4d1019 = _0x4241f4 === _0x2bf864.SALES ? "مبيعات" : "مشتريات";
            const _0x51e0ca = "جاري تحميل " + _0x4d1019 + " شهر " + _0x5b219b + "/" + _0x58971e;
            const _0x58240c = await _0x1fdc13(_0x5b219b, _0x58971e, _0x4241f4, (_0x7d45b, _0x5878ea) => {
              const _0xb11dde = _0x1221e4 / _0x273493 * 100 + _0x5878ea / _0x273493;
              _0x53a4d0(_0x51e0ca, _0xb11dde);
            });
            _0x2ef81c.push(..._0x58240c);
            _0x1221e4++;
          }
        }
      }
      if (_0x2ef81c.length === 0) {
        const _0x3604e3 = _0x5394e7 ? "تم الإيقاف قبل تحميل أي فواتير." : "لم يتم العثور على أي فواتير في النطاق المحدد.";
        _showToast(_0x3604e3);
        _0x2b1ea5.style.display = "none";
        return;
      }
      if (!_0x5394e7 && _0x95ae5e.detailsMode === "full") {
        _0x53a4d0("✅ اكتمل تحميل " + _0x2ef81c.length + " فاتورة. جاري الآن جلب تفاصيل الأصناف...", 0);
        for (let _0x20e42c = 0; _0x20e42c < _0x2ef81c.length; _0x20e42c++) {
          if (_0x5394e7) {
            break;
          }
          _0x53a4d0("جاري جلب تفاصيل الفاتورة " + (_0x20e42c + 1) + " من " + _0x2ef81c.length + "...", (_0x20e42c + 1) / _0x2ef81c.length * 100);
          const _0x1b86de = await _0x5acc55(_0x2ef81c[_0x20e42c], _0x2ef81c[_0x20e42c].VATFileType);
          if (_0x1b86de.length > 0) {
            _0x534309 = _0x534309.concat(_0x1b86de);
          }
        }
      }
      if (_0x5394e7) {
        _0x53a4d0("تم الإيقاف. جاري تصدير " + _0x2ef81c.length + " فاتورة...", 100);
      } else {
        _0x53a4d0("✅ اكتملت العملية. جاري إنشاء ملف Excel...", 100);
      }
      await _0x9f542c(_0x2ef81c, _0x534309, _0x4ea5b4, _0x3f9347);
      _0x3f163b.textContent = "🎉";
      _0x4e08ee.textContent = _0x5394e7 ? "تم الإيقاف وتصدير " + _0x2ef81c.length + " فاتورة." : "تمت العملية بنجاح! تحقق من مجلد التنزيلات.";
      _0x31291d.style.backgroundColor = "#a6e3a1";
      setTimeout(() => {
        _0x2b1ea5.style.display = "none";
      }, 5000);
    } catch (_0x4392c0) {
      _0x3f163b.textContent = "❌";
      _0x53a4d0("فشل: " + _0x4392c0.message, 100);
      _0x31291d.style.backgroundColor = "#f38ba8";
      setTimeout(() => {
        _0x2b1ea5.style.display = "none";
        _0x31291d.style.backgroundColor = "#6366f1";
      }, 8000);
    }
  }
  function _0x3e6152() {
    if (document.getElementById("fawateer-progress-widget")) {
      return;
    }
    const _0x435133 = "\n        <div id=\"fawateer-progress-widget\" style=\"display:none; position:fixed; bottom:20px; right:20px; width:350px; background-color:#1e1e2e; z-index:10002; border-radius:12px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); font-family:'Segoe UI',tahoma; direction:rtl; border-top: 4px solid #6366f1; transition: all 0.3s ease; border: 1px solid #313244;\">\n            <div id=\"fawateer-widget-header\" style=\"padding:10px 15px; background-color:#181825; cursor:move; display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #313244; border-radius: 12px 12px 0 0; user-select:none;\">\n                <span style=\"font-weight:bold; color:#cdd6f4;\">شريط تقدم التحميل</span>\n                <button id=\"fawateer-widget-toggle\" style=\"background:transparent; border:none; font-size:20px; cursor:pointer; color:#6c7086;\">–</button>\n            </div>\n            <div id=\"fawateer-widget-content\" style=\"padding:15px; display:flex; flex-direction:column; gap:10px; transition: all 0.3s ease;\">\n                <div id=\"fawateer-status-icon\" style=\"font-size:24px; text-align:center;\">⏳</div>\n                <p id=\"fawateer-progress-text\" style=\"margin:0; font-weight:bold; font-size:15px; color: #cdd6f4; text-align:center;\"></p>\n                <div style=\"background-color:#313244; border-radius:8px; overflow:hidden; height:14px;\">\n                    <div id=\"fawateer-progress-bar\" style=\"width:0%; height:100%; background-image: linear-gradient(to right, #6366f1, #8b5cf6); transition: width 0.4s ease-in-out;\"></div>\n                </div>\n                <button id=\"fawateer-stop-btn-widget\" style=\"background: linear-gradient(135deg, #f38ba8, #eba0ac); color:#1e1e2e; border:none; padding: 10px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:15px; margin-top:10px;\">✋ إيقاف والتصدير</button>\n            </div>\n        </div>\n    ";
    document.body.insertAdjacentHTML("beforeend", _0x435133);
    const _0x27c78b = document.getElementById("fawateer-progress-widget");
    const _0x15e13a = document.getElementById("fawateer-widget-content");
    const _0x2a9a59 = document.getElementById("fawateer-widget-toggle");
    _0x2a9a59.addEventListener("click", () => {
      const _0x2f84c1 = _0x15e13a.style.display === "none";
      _0x15e13a.style.display = _0x2f84c1 ? "flex" : "none";
      _0x2a9a59.textContent = _0x2f84c1 ? "–" : "+";
    });
    const _0x16e89c = document.getElementById("fawateer-widget-header");
    let _0x24cea3 = 0;
    let _0x36acf9 = 0;
    let _0x10a764 = 0;
    let _0x1e99bd = 0;
    _0x16e89c.onmousedown = _0x5ef8c3 => {
      _0x5ef8c3.preventDefault();
      _0x10a764 = _0x5ef8c3.clientX;
      _0x1e99bd = _0x5ef8c3.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = _0x34cd1c => {
        _0x34cd1c.preventDefault();
        _0x24cea3 = _0x10a764 - _0x34cd1c.clientX;
        _0x36acf9 = _0x1e99bd - _0x34cd1c.clientY;
        _0x10a764 = _0x34cd1c.clientX;
        _0x1e99bd = _0x34cd1c.clientY;
        _0x27c78b.style.top = _0x27c78b.offsetTop - _0x36acf9 + "px";
        _0x27c78b.style.left = _0x27c78b.offsetLeft - _0x24cea3 + "px";
      };
    };
  }
  async function _0x20dbf7() {
    const _toggles = window.__ETA_AIO_TOGGLES__ || { credentials: true, vatDownload: true, invoiceExport: true };

    if (_toggles.credentials) {
      _0x57fb6c();
      _0x547395();
    }
    if (_toggles.vatDownload) {
      _0x139d96();
    }
    if (_toggles.invoiceExport) {
      _0x43c11c();
    }

    let _0x2b4b32 = location.href;
    new MutationObserver(() => {
      if (location.href !== _0x2b4b32) {
        _0x2b4b32 = location.href;
        if (_toggles.vatDownload) _0x139d96();
        if (_toggles.invoiceExport) _0x43c11c();
        if (_toggles.credentials) {
          _0x547395();
          _0x57fb6c();
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  function _0x31ccf0(_0xec7672) {
    if (typeof ExcelJS === "undefined") {
      _showToast("مكتبة ExcelJS غير محملة.");
      return;
    }
    if (!_0xec7672 || Object.keys(_0xec7672).length === 0) {
      _showToast("لا توجد بيانات محفوظة لتصديرها.");
      return;
    }
    const _0x374d75 = new ExcelJS.Workbook();
    const _0x464d6c = _0x374d75.addWorksheet("بيانات الدخول المحفوظة");
    _0x464d6c.columns = [{
      header: "اسم العميل (Customer Name)",
      key: "company",
      width: 40
    }, {
      header: "اسم المستخدم (Username)",
      key: "username",
      width: 40
    }, {
      header: "كلمة المرور (Password)",
      key: "password",
      width: 40
    }];
    _0x464d6c.getRow(1).font = {
      bold: true
    };
    for (const [_0x1a53b6, _0x37e36c] of Object.entries(_0xec7672)) {
      _0x464d6c.addRow({
        company: _getCustName(_0x37e36c) || "",
        username: _0x1a53b6,
        password: _0x37e36c.password
      });
    }
    _0x374d75.xlsx.writeBuffer().then(_0x38a480 => {
      const _0x3214c2 = new Blob([_0x38a480], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const _0x11d837 = new Date().toISOString().split("T")[0];
      saveAs(_0x3214c2, "بيانات_الدخول_المحفوظة_" + _0x11d837 + ".xlsx");
    }).catch(_0x154bec => {
      _showToast("حدث خطأ أثناء إنشاء ملف الإكسل.");
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x20dbf7);
  } else {
    _0x20dbf7();
  }
})();