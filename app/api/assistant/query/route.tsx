import { type NextRequest, NextResponse } from "next/server"

const knowledgeBaseData = [
  {
    id: "ACC-01",
    category: "帳號申請與設定",
    tags: ["申請", "辦理", "新辦", "如何辦理", "企業網銀"],
    question: "我的公司想申請企業網路銀行，請問該如何辦理？",
    answer_html:
      "<p>您好，貴公司只要符合以下條件並準備好文件，即可向本行任一分行臨櫃辦理：</p><ul><li><strong>申請資格：</strong>只要是公司、行號、政府機關、學校、公營事業或其他團體，且已在本行開設活期性存款帳戶（含支票存款戶）。</li><li><strong>辦理文件（由負責人攜帶）：</strong>主管機關核准設立的證明文件（如公司設立登記表）、繳納營業稅的證明、負責人本人的身分證、公司原留印鑑。</li><li><strong>申請代表帳號：</strong>您只需選擇其中一個活期性存款帳戶進行申請，該帳號將作為您的網路銀行申請代表帳號。</li><li><strong>開通程序：</strong>申辦完成後，本行將核發網路銀行密碼單。請您在收到密碼單後一個月內，使用上面的使用者代號和密碼初值登入企業網路銀行，並依指示完成密碼變更，即可啟用服務。<ul><li>「使用者代號初值」企業戶為「admin」，登錄後可自行變更為6至20碼英數字（英文字母不區分大小寫）。</li><li>「密碼初值」為八碼隨機數字，登錄後可自行變更為8至16碼英數字，並限採英數字混合使用（英文字母區分大小寫）。</li></ul></li></ul>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
    recommendations: [
      {
        text: "需要營運資金嗎？了解我們的中小企業貸款方案",
        url: "/business-loan",
        priority: "high",
        context: "enterprise_account_application",
      },
    ],
  },
  {
    id: "ACC-02",
    category: "帳號申請與設定",
    tags: ["資格", "條件", "團體", "行號", "企業網銀"],
    question: "請問哪些公司或團體可以申請企業網路銀行？",
    answer_html:
      "<p>只要是公司、行號、政府機關、學校、公營事業或其他團體，並且在本行有開設活期性存款帳戶（包含支票存款戶），都可以申請我們的企業網路銀行服務。</p>",
    quick_actions: [],
  },
  {
    id: "ACC-03",
    category: "帳號申請與設定",
    tags: ["非約定轉帳", "開通", "線上設定", "功能"],
    question: "我想開通「非約定帳號轉帳」功能，可以在線上設定嗎？",
    answer_html:
      "<p>為了保障您的帳戶安全，此功能目前無法直接在線上開通。煩請貴公司的負責人，攜帶相關證明文件、身分證及原留印鑑，親自前往本行任一分行辦理。</p>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "ACC-04",
    category: "帳號申請與設定",
    tags: ["快速登入", "APP", "手機", "設定"],
    question: "我要如何設定用手機「快速登入」企業網路銀行APP？",
    answer_html:
      "<p>請您先由公司的<strong>「授權主管」</strong>登入電腦版企業網路銀行，進入「管理服務」後啟用「行動網銀」及「快速登入」功能，並確認您的手機號碼已設定完成。接著，您就可以在手機APP上，登入並進入「快速登入管理」功能，完成裝置綁定及使用者設定。</p>",
    quick_actions: [{ text: "下載企業網銀APP", url: "/app-download" }],
  },
  {
    id: "ACC-05",
    category: "帳號申請與設定",
    tags: ["第一次", "首次使用", "安裝", "軟體", "安控元件"],
    question: "第一次使用企業網路銀行，需要安裝什麼軟體嗎？",
    answer_html:
      "<p>是的，為確保您的交易安全，首次使用請務必前往企業網路銀行的登入頁面，點選左側的「軟體下載」或「土地銀行安控元件」，並依照網頁指示完成必要的安控元件安裝。</p>",
    quick_actions: [{ text: "前往軟體下載", url: "/download" }],
  },
  {
    id: "NET-01",
    category: "網路銀行服務與管理",
    tags: ["電子郵件", "通知", "服務"],
    question: "何謂電子郵件通知服務？",
    answer_html:
      "<p>企業網路銀行系統會主動發送多種重要資訊至您留存的電子郵件信箱，包括交易明細對帳單通知、定期存款到期通知、網路銀行密碼錯誤通知、約定及非約定轉帳交易通知、憑證即將到期通知（30天及7天前）、轉帳餘額不足通知、轉帳超過限額通知、使用者代號錯誤通知（5次以上）等。本項服務您可自行於線上進行變更。</p>",
    quick_actions: [],
  },
  {
    id: "NET-02",
    category: "網路銀行服務與管理",
    tags: ["密碼", "重置", "遺忘", "鎖住"],
    question: "遺忘網路銀行密碼或被鎖住時，該如何重置？",
    answer_html:
      "<ul><li><strong>授權主管：</strong>若不慎遺忘密碼或因連續錯誤達三次而被系統鎖住，貴公司的授權主管可就任一活期性存款帳戶（含支票存款戶），向本行任一營業單位辦理密碼重置手續。</li><li><strong>一般使用者：</strong>若一般使用者不慎遺忘密碼或被鎖住，可透過授權主管登入系統，在使用者管理介面中點選【重置密碼】按鍵來處理。</li></ul>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "NET-03",
    category: "網路銀行服務與管理",
    tags: ["註銷", "停止使用", "企業網銀"],
    question: "不再使用企業網路銀行時，該如何註銷服務？",
    answer_html:
      "<p>您可以透過以下兩種方式註銷企業網路銀行服務：</p><ul><li><strong>臨櫃申請：</strong>存戶可就其任一活期性存款帳戶（含支票存款戶）向本行任一營業單位辦理。</li><li><strong>線上申請：</strong>存戶可由授權主管登入企業網路銀行，於「管理服務」中點選【網銀註銷】功能。</li></ul>",
    quick_actions: [
      { text: "前往企業網銀登入", url: "/login" },
      { text: "查詢最近分行", url: "/branch-locator" },
    ],
  },
  {
    id: "NET-04",
    category: "網路銀行服務與管理",
    tags: ["密碼變更", "修改密碼", "安全性"],
    question: "如何變更企業網路銀行登入密碼？",
    answer_html:
      "<p>當您認為密碼有變更的必要時，可隨時自行登入企業網路銀行進行變更，次數不受限制。操作步驟為：登入企業網路銀行 → 點選「管理服務」→「個人資料維護」→「密碼變更」。</p>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "SSL-01",
    category: "SSL轉帳服務及轉帳限額",
    tags: ["SSL轉帳", "服務說明", "線上轉帳"],
    question: "何謂SSL轉帳服務？",
    answer_html:
      "<p>存戶向任一營業單位申請企業網路銀行，並啟用SSL轉帳服務及約定轉入帳號後，即可透過企業網路銀行採用的SSL安控加密機制辦理線上轉帳。</p>",
    quick_actions: [],
  },
  {
    id: "SSL-02",
    category: "SSL轉帳服務及轉帳限額",
    tags: ["SSL轉帳", "限額", "轉帳限制"],
    question: "SSL轉帳的限額是多少？",
    answer_html:
      "<p>每一存款帳戶的轉出限額如下：</p><ul><li><strong>每次轉出限額：</strong><ul><li>自行同戶名轉帳：不限額度。(存戶可依需要線上啟用，未啟用與「自行不同戶名轉帳」合計為300萬元)</li><li>自行不同戶名轉帳：300萬元。</li><li>跨行轉帳：200萬元。</li></ul></li><li><strong>每日累計轉出限額：</strong><ul><li>自行同戶轉帳：不限額度。(存戶可依需要線上啟用，未啟用與「自行不同戶名及跨行轉帳」合計為300萬元)</li><li>自行不同戶及跨行轉帳合計：300萬元。</li></ul></li></ul>",
    quick_actions: [],
  },
  {
    id: "SSL-03",
    category: "SSL轉帳服務及轉帳限額",
    tags: ["SSL約定轉帳", "限額", "約定轉入"],
    question: "SSL約定轉入帳戶的轉帳限額是多少？",
    answer_html: "<p>每筆限額及每一轉出帳戶每日累計轉帳限額均為新台幣三百萬元（其中跨行轉帳每筆限額為200萬元）。</p>",
    quick_actions: [],
  },
  {
    id: "FXML-01",
    category: "金融XML憑證服務",
    tags: ["FXML憑證", "XML憑證", "申請", "功能"],
    question: "何謂金融XML憑證(FXML憑證)？我是否需要申請？",
    answer_html:
      "<p>FXML憑證是由具公信力的安全認證中心所核發，應用於網際網路交易作為身分辨識資料，以確保交易資料的隱密性、安全性、完整性、辨識性及交易的不可否認性。如果您有大金額轉帳、非約定轉帳或任何需要確認身分的憑證需求，建議向本行任一營業單位申請FXML憑證服務。</p>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "FXML-02",
    category: "金融XML憑證服務",
    tags: ["憑證代表帳號", "憑證適用帳號", "設定", "說明"],
    question: "什麼是憑證代表帳號與憑證適用帳號？",
    answer_html:
      "<ul><li><strong>憑證代表帳號：</strong>您申請憑證時所使用的存款帳號，可就任一活期性存款帳戶（含支票存款戶）向開戶單位辦理。您在本行約定後，必須登入企業網路銀行啟用憑證。</li><li><strong>憑證適用帳號：</strong>為方便您管理，您可以將在本行各營業單位開設的其他活期性存款帳戶（含支票存款戶），一併列舉約定為憑證適用帳號，使這些帳號也能適用於憑證代表帳號（需加蓋各適用帳號的原留印鑑）。</li><li>請注意，每個存款代表帳號只能申請一張憑證，但同一歸戶編號不限制只能申請一個憑證。</li></ul>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "FXML-03",
    category: "金融XML憑證服務",
    tags: ["憑證適用帳號", "填寫時機", "憑證設定"],
    question: "什麼時候需要填列憑證適用帳號？",
    answer_html:
      "<ul><li><strong>首次申辦FXML憑證服務時：</strong>若您在本行各分行有同戶名帳號，可在首次申辦憑證時一併填列於憑證適用帳號，以簡化申請手續（須加蓋各帳號原留印鑑）。</li><li><strong>適用帳號約定變更：</strong>如果您已申請憑證，但希望新增或取消憑證適用帳號的約定，也可在此時進行填列。</li></ul>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "FXML-04",
    category: "金融XML憑證服務",
    tags: ["憑證", "暫停", "恢復", "出國"],
    question: "如果存戶出國或暫時不需要使用憑證，該如何暫停／恢復使用？",
    answer_html:
      "<p>一、憑證之有效期限為一年，存戶應自行於憑證到期前一個月登入企業網路銀行申請展期。</p><p>二、逾期未申請該憑證即失效，須親洽任一開戶行辦理憑證註銷（持身分證、該分行存摺及原留印鑑），並另書面辦理憑證申請手續（即申請新憑證）。</p>",
    quick_actions: [
      { text: "前往企業網銀登入", url: "/login" },
      { text: "查詢最近分行", url: "/branch-locator" },
    ],
  },
  {
    id: "FXML-05",
    category: "金融XML憑證服務",
    tags: ["憑證", "註銷", "取消憑證"],
    question: "存戶如果想註銷憑證，應該如何辦理？",
    answer_html:
      "<p>存戶可親洽任一開戶行辦理憑證註銷（需持身分證、該分行存摺及原留印鑑）。註銷後，使用該憑證預約的網路銀行交易將不執行。因此，除非您確定未來不再使用、憑證遺失或損毀，或懷疑憑證被盜用等情況，才建議申請註銷。</p>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "FXML-06",
    category: "金融XML憑證服務",
    tags: ["憑證", "註銷後", "交易"],
    question: "註銷憑證後，還能再進行企業網路銀行交易嗎？",
    answer_html:
      "<p>註銷憑證後，您將無法再使用該憑證進行企業網路銀行交易。若要繼續進行交易，請向本行任一營業單位重新申請FXML憑證服務。</p>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "FXML-07",
    category: "金融XML憑證服務",
    tags: ["憑證", "過期", "展期", "重新申請"],
    question: "憑證過期未申請展期，欲繼續使用憑證時應如何辦理？",
    answer_html:
      "<p>一、憑證之有效期限為一年，存戶應自行於憑證到期前一個月登入企業網路銀行申請展期。</p><p>二、逾期未申請該憑證即失效，須親洽任一開戶行辦理憑證註銷（持身分證、該分行存摺及原留印鑑），並另書面辦理憑證申請手續（即申請新憑證）。</p>",
    quick_actions: [
      { text: "前往企業網銀登入", url: "/login" },
      { text: "查詢最近分行", url: "/branch-locator" },
    ],
  },
  {
    id: "FXML-08",
    category: "金融XML憑證服務",
    tags: ["憑證", "國外", "交易", "使用"],
    question: "在國外能否啟用FXML憑證及進行網路交易？",
    answer_html:
      "<p>當然可以，網路無國界。只要您能夠連上網路，就可以透過網路啟用FXML憑證及進行網路交易。不過，請務必注意對FXML憑證的保密及備份。</p>",
    quick_actions: [],
  },
  {
    id: "FXML-09",
    category: "金融XML憑證服務",
    tags: ["憑證", "作業系統", "瀏覽器", "要求"],
    question: "啟用FXML憑證時，對作業系統及瀏覽器版本有何要求？",
    answer_html:
      "<p>建議您所使用的電腦作業系統為Microsoft Windows Vista/7/8/10，瀏覽器可使用Chrome、Firefox、Safari (MAC 作業系統)。</p>",
    quick_actions: [],
  },
  {
    id: "FXML-10",
    category: "金融XML憑證服務",
    tags: ["憑證更新", "原有憑證", "有效性"],
    question: "FXML憑證更新後，原有FXML憑證是否有效？",
    answer_html: "<p>原有FXML憑證在更新後仍然有效，直到其過期為止。</p>",
    quick_actions: [],
  },
  {
    id: "AGR-01",
    category: "約定轉入帳號服務",
    tags: ["新增", "約定轉入", "辦理"],
    question: "如何新增約定轉入帳號？",
    answer_html:
      "<p>存戶可向本行任一營業單位提出申請，並依轉出帳號逐戶辦理新增約定轉入帳號。請注意，該約定轉入帳戶於申辦日之次二日（日曆日）起，始可於企業網路銀行進行交易。</p>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "AGR-02",
    category: "約定轉入帳號服務",
    tags: ["刪除", "約定轉入", "取消"],
    question: "如何刪除約定轉入帳號？",
    answer_html: "<p>存戶可於企業網路銀行線上直接辦理刪除，或親洽本行任一營業單位書面約定辦理。</p>",
    quick_actions: [
      { text: "前往企業網銀登入", url: "/login" },
      { text: "查詢最近分行", url: "/branch-locator" },
    ],
  },
  {
    id: "AGR-03",
    category: "約定轉入帳號服務",
    tags: ["SSL轉帳", "FXML轉帳", "自動適用"],
    question: "約定轉入帳號是否可自動適用於SSL轉帳及FXML轉帳？",
    answer_html: "<p>是的，約定轉入帳號可自動同時適用於SSL轉帳及FXML轉帳，無需重複約定。</p>",
    quick_actions: [],
  },
  {
    id: "AGR-04",
    category: "約定轉入帳號服務",
    tags: ["繳稅費", "約定轉入", "免約定"],
    question: "繳稅費是否需要新增為約定轉入帳號？",
    answer_html:
      "<p>繳納稅規費、公用事業費用、本人信用卡費及本人貸款本息等，均視同約定轉入帳戶，存戶無需額外新增為約定轉入帳號。</p>",
    quick_actions: [],
  },
  {
    id: "NON-AGR-01",
    category: "非約定轉入帳戶轉帳服務",
    tags: ["啟用", "非約定轉帳", "FXML"],
    question: "如何啟用非約定轉入帳戶轉帳服務？",
    answer_html:
      "<ul><li>存戶可向本行任一營業單位提出申請，並依轉出帳號逐戶辦理啟用「非約定轉入帳戶轉帳服務」（此服務適用於FXML機制）。</li><li>請注意，未書面啟用者將無法進行非約定轉入帳戶轉帳交易，以確保您的權益。</li><li>申請啟用時，請一併勾選電子郵件通知（通知-帳務類）並填妥電子郵箱地址。若您有非約定轉入帳戶轉帳交易，本行系統將會即時逐筆以電子郵件寄送轉帳相關訊息至您在本行事先登錄的電子郵箱，以防範盜轉事件。</li></ul>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "NON-AGR-02",
    category: "非約定轉入帳戶轉帳服務",
    tags: ["停用", "非約定轉帳", "取消"],
    question: "如何停用非約定轉入帳戶轉帳服務？",
    answer_html:
      "<p>存戶欲停用此服務時，可至企業網路銀行就轉出帳戶逐戶線上直接辦理，或親自向轉出帳戶的原開戶單位書面約定辦理。</p>",
    quick_actions: [
      { text: "前往企業網銀登入", url: "/login" },
      { text: "查詢最近分行", url: "/branch-locator" },
    ],
  },
  {
    id: "NON-AGR-03",
    category: "非約定轉入帳戶轉帳服務",
    tags: ["非約定轉帳", "限額", "FXML"],
    question: "非約定轉帳的限額為何？（FXML機制）",
    answer_html:
      "<ul><li><strong>每次轉出限額：</strong>預設值為新臺幣5萬元。</li><li><strong>每一存款帳戶之累計轉出限額：</strong>預設值為每日10萬元，每月20萬元（此項額度單獨計算）。</li><li>若您有調高新臺幣轉帳額度「上限」的需求，請備妥相關存款帳戶原留印鑑及身分證明文件正本，至本行任一營業單位臨櫃書面申請。授權主管可在書面約定之額度上限內，自行至企業網路銀行調整轉帳額度。</li></ul>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "SEC-01",
    category: "網路交易安全性說明",
    tags: ["網路轉帳", "安全", "保障"],
    question: "網路轉帳是否安全？",
    answer_html:
      "<p>本行企業網路銀行轉帳交易要求輸入您的身分證字號或統一編號、使用者代號及登入密碼，並透過加密保護及使用者簽章機制，多重保障交易安全。這確保了交易資料的隱密性、安全性、完整性、身分辨識性及交易的不可否認性。</p>",
    quick_actions: [],
  },
  {
    id: "SEC-02",
    category: "網路交易安全性說明",
    tags: ["交易安全", "加強", "防範"],
    question: "存戶應如何加強網路交易安全？",
    answer_html:
      "<ul><li>企業網路銀行登入密碼及FXML憑證密碼宜設定不同的組合，並避免使用容易被猜測的數字或文字。</li><li>建議您經常不定期變更企業網路銀行登入密碼。</li><li>輸入密碼時務必慎防他人窺視，切勿將密碼告知他人，也不要將密碼書寫於他人容易取得之處。</li><li>離開座位或交易完畢後，請養成登出網路銀行的習慣。</li><li>為保護您的網路銀行交易安全，請勿使用公用電腦（如：網路咖啡店）進行網路銀行交易（包括查詢交易），並請確認您使用的電腦已採取足夠的安全防範措施（如：安裝防毒軟體、不安裝來路不明的軟體，以及不開啟不明電子郵件的附件檔等）。</li><li>為防範偽冒網站，當您登入本行相關網站時，請務必注意網址是否正確。如發現任何可疑的交易或網站頁面，請儘速通知本行。</li></ul>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "OPR-01",
    category: "操作問題",
    tags: ["交易逾時", "錯誤訊息", "登入問題"],
    question: "使用者登入企業網路銀行時，為何會出現「交易逾時，請稍候再試」訊息？",
    answer_html:
      "<p>這可能是由於系統在進行身分驗證或下傳帳戶資料時，受到當時網路連線中斷的影響而導致交易失敗。您只需稍候重新連線，再次嘗試登入企業網路銀行即可。</p>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "OPR-02",
    category: "操作問題",
    tags: ["登入問題", "畫面空白", "6350錯誤", "解決方法"],
    question:
      "登入企業網路銀行後，畫面呈現空白，或是出現「6350錯誤-您已有使用其他帳號登入企業網路銀行,請將已登入視窗關閉後再行登入」？",
    answer_html:
      "<ul><li><strong>畫面呈現空白：</strong>這通常是客戶端電腦環境設定問題。建議您嘗試重啟瀏覽器，或檢查瀏覽器的進階安全性設定。</li><li><strong>6350錯誤：</strong>這表示您已有其他企業網路銀行的視窗未完全關閉。請將所有瀏覽器視窗關閉，並使用「工作管理員」確認所有瀏覽器相關程序皆已結束後，再重新開啟瀏覽器進行登入，即可解決此問題。</li></ul>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "OPR-03",
    category: "操作問題",
    tags: ["安控元件", "安裝問題", "交易服務", "風險"],
    question:
      "為何在執行繳款、基金、外幣交易服務時，會出現要我安裝土地銀行安控元件的訊息？安裝與不安裝該元件有何影響？安裝該元件會不會有什麼風險？為什麼我選擇安裝元件後，卻沒有安裝成功？",
    answer_html:
      "<ul><li><strong>目的：</strong>為提升網路銀行安全控管機制，以防範網路犯罪並確保客戶存款權益，在執行這些交易時，會針對敏感性資料增加押密保護傳送機制，以維護網路交易安全。</li><li><strong>影響：</strong>若客戶電腦未安裝土地銀行安控元件，執行交易時會出現警告訊息。若您選擇不安裝或安裝不成功，下次執行繳款、基金、外幣等交易服務時會再次出現該訊息。</li><li><strong>風險：</strong>此元件不具惡意程式或偵測隱私的作用，請客戶放心安裝。</li><li><strong>安裝失敗：</strong>安裝此元件需要以擁有系統最大權限者（administrator）登入系統後，才可成功安裝。此外，由於元件安裝的控制權在客戶端電腦，若瀏覽器設定限制較多，可能導致無法成功安裝。</li></ul>",
    quick_actions: [{ text: "前往軟體下載", url: "/download" }],
  },
  {
    id: "OPR-05",
    category: "操作問題",
    tags: ["交易資料", "安全", "盜取", "纂改"],
    question: "網路上的交易資料，會不會被盜取或是被纂改？",
    answer_html:
      "<p>存戶於企業網路銀行進行的交易資料，都經過嚴格的加密保護，並且加上使用者的簽章做為身分辨識及確認。如果資料在網路上被盜取，也只會是一堆無意義的亂碼。若是資料被破解且被纂改後，簽章就會失效，本行交易系統一旦接收到此筆被纂改過的交易申請，經由驗章手續後，就會發現此筆資料已被纂改。系統將會中止此筆交易，並通知使用者，系統管理者也會繼續追查纂改者來源，並採取必要的防範措施。</p>",
    quick_actions: [],
  },
  {
    id: "TRANS-01",
    category: "轉帳與交易問題",
    tags: ["2380", "付款帳號未約定", "FXML憑證"],
    question: "我轉帳失敗了，失敗原因顯示「2380-付款帳號未約定」。",
    answer_html:
      "<p>這個訊息表示您使用的付款帳號，尚未綁定您的FXML憑證。請您確認憑證資料，若帳號未綁定，交易時就無法選擇使用FXML憑證來放行。</p>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "TRANS-02",
    category: "轉帳與交易問題",
    tags: ["2806", "戶名不一致", "帳號錯誤"],
    question: "我轉帳失敗，畫面顯示「2806-收款人之戶名與帳號不一致」。",
    answer_html: "<p>這表示您輸入的收款人「帳號」和「戶名」對不起來。請您和收款人再次確認，並輸入完全正確的資料。</p>",
    quick_actions: [],
  },
  {
    id: "TRANS-03",
    category: "轉帳與交易問題",
    tags: ["2310", "2341", "2410", "2430", "收款帳號問題"],
    question: "我轉帳時出現錯誤代碼如 2310、2341、2410、2430 等訊息，代表什麼意思？",
    answer_html:
      "<p>這些代碼都表示收款方的帳號有狀況，常見原因如下：<br>* 2310/2410: 收款帳號可能已結清、變成靜止戶，或是警示帳戶。<br>* 2340/2341: 收款人的戶名和帳號對不起來。<br>* 2430/2815: 此帳戶不符合交易資格，無法匯入款項。<br>請您先與收款人聯繫，確認帳戶狀態與資料是否正確。</p>",
    quick_actions: [],
  },
  {
    id: "TRANS-04",
    category: "轉帳與交易問題",
    tags: ["399", "跨行交易異常", "轉帳失敗"],
    question: "轉帳交易失敗，出現錯誤代碼「399-跨行交易異常」，是什麼原因？",
    answer_html:
      "<p>這可能有幾種情況：<br>1. 請和收款人確認，他們的帳戶是否能接收一般的電子匯款（部分公家機關或特殊專戶有限制）。<br>2. 可能是對方銀行的系統暫時沒有回應，建議您可以稍後再試一次。<br>3. 若持續失敗，請聯繫本行電子金融部協助查詢。</p>",
    quick_actions: [],
  },
  {
    id: "TRANS-05",
    category: "轉帳與交易問題",
    tags: ["6279", "審核人員", "此交易未設定流程"],
    question: "我是審核人員，但登入後在某些查詢功能都看不到資料，還出現錯誤「6279 此交易未設定流程」。",
    answer_html:
      "<p>這是正常的系統設定。因為您的身分是<strong>「審核人員」</strong>，主要功能是審核由經辦人員建立的交易，所以無法直接查詢或編輯資料。請您到首頁的待辦事項區（六個圓圈圈圖示），找到待審核的交易並進行作業即可。</p>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "TRANS-06",
    category: "轉帳與交易問題",
    tags: ["預約轉帳", "餘額不足", "扣款失敗"],
    question: "我設定了預約轉帳，但當天因為帳戶餘額不足而扣款失敗，會重新扣款嗎？",
    answer_html:
      "<p>預約交易在當天只會執行一次扣款。如果失敗了，系統不會再自動執行。您可以在補足款項後，改為手動執行該筆轉帳交易。</p>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
  {
    id: "CERT-01",
    category: "憑證與讀卡機問題",
    tags: ["9045", "9110", "IFX簽章模組", "安控元件"],
    question: "使用晶片卡操作時，一直出現錯誤代碼 (例如9045, 9110, IFX簽章模組不正確等)，該怎麼辦？",
    answer_html:
      "<p>這通常是安控元件的問題，您可以依照以下步驟處理：<br>1. 請先到企業網銀首頁的「軟體下載」區，重新下載並安裝<strong>「土銀安控元件」（安裝時請按右鍵選擇「以系統管理員身分執行」）。<br>2. 安裝完成後，請將晶片卡插入讀卡機，登入網銀後至「客戶端環境檢核」</strong>頁面，若所有項目都檢測成功，即可正常交易。</p>",
    quick_actions: [{ text: "前往軟體下載", url: "/download" }],
  },
  {
    id: "CERT-02",
    category: "憑證與讀卡機問題",
    tags: ["9056", "讀取憑證資料失敗", "晶片卡"],
    question: "轉帳時出現「讀取憑證資料失敗!! 錯誤代碼:9056」，該怎麼辦？",
    answer_html:
      "<p>請您嘗試以下方法：<br>1. 清潔晶片：用橡皮擦或酒精棉片，輕輕擦拭卡片上的金色晶片。<br>2. 重新連接：將讀卡機的USB線拔掉重插，或將電腦重新開機。<br>3. 確認讀卡機：若您電腦連接了多台讀卡機，請在交易時，於下拉選單中確認選到正確的裝置。<br>4. 確認相容性：若您使用蘋果電腦，請確認您的讀卡機型號是否支援。</p>",
    quick_actions: [],
  },
  {
    id: "CERT-03",
    category: "憑證與讀卡機問題",
    tags: ["9111", "P11登出失敗", "簽章失敗"],
    question: "我操作時出現簽章失敗，錯誤代碼「9111」或「P11登出失敗」，該怎麼辦？",
    answer_html: "<p>這表示安控元件沒有正常啟動。請您重新安裝一次安控元件，然後將電腦重新開機後再試試。</p>",
    quick_actions: [{ text: "前往軟體下載", url: "/download" }],
  },
  {
    id: "CERT-04",
    category: "憑證與讀卡機問題",
    tags: ["32769", "卡片內無憑證", "憑證測試"],
    question: "憑證測試時發生錯誤，代碼「32769」，訊息是「卡片內無憑證」。",
    answer_html:
      "<p>請先確認以下幾點：<br>1. 您插入的是否為正確的「企業網銀FXML憑證卡」，而不是一般金融卡。<br>2. 請至我們官網「軟體下載」區，下載<strong>「CardToolClient」</strong>工具，用它來讀取卡片，確認裡面是否有憑證資料。<br>3. 部分讀卡機（如 EASYATM COMBO）可能會有相容性問題，建議您更換其他讀卡機試試。</p>",
    quick_actions: [{ text: "前往軟體下載", url: "/download" }],
  },
  {
    id: "CERT-05",
    category: "憑證與讀卡機問題",
    tags: ["36896", "PIN Code已鎖", "憑證密碼"],
    question: "畫面顯示「36896 PIN Code 已鎖」，是什麼思？",
    answer_html:
      "<p>這表示您的FXML憑證卡密碼（PIN碼）連續輸入錯誤三次，卡片已被鎖定。需要麻煩您親自到分行辦理<strong>「解鎖卡片」</strong>或「重置密碼」。</p>",
    quick_actions: [{ text: "查詢最近分行", url: "/branch-locator" }],
  },
  {
    id: "CERT-06",
    category: "憑證與讀卡機問題",
    tags: ["9041", "Mac電腦", "中文輸入法", "全形數字"],
    question: "Mac電腦輸入憑證密碼時，出現「9041」錯誤。",
    answer_html:
      "<p>這很可能是因為您在輸入密碼時，輸入法是<strong>「中文」</strong>模式，導致輸入的數字變成「全形數字」。請將輸入法切換回英文模式，再重新輸入一次密碼即可。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-01",
    category: "一般系統與操作問題",
    tags: ["放行問題", "錯誤訊息", "客服"],
    question: "我在操作放行時，如果遇到問題或看到錯誤訊息，可以問誰？",
    answer_html:
      "<p>如果在營業時間，您可以直接聯繫與貴公司往來的分行電子金融專員，或撥打我們的服務專線 (02) 2348-3876，將有專人為您服務。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-02",
    category: "一般系統與操作問題",
    tags: ["請稍候再試", "系統維護", "無法提供服務"],
    question: "畫面跳出「請稍候再試」、「系統目前無法提供此服務」等訊息。",
    answer_html: "<p>這可能是系統暫時忙碌或正在維護，請您稍候片刻再重新嘗試操作。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-03",
    category: "一般系統與操作問題",
    tags: ["狀態碼500", "網頁無法回應", "系統斷線"],
    question: "畫面出現「狀態碼500-網頁暫時無法回應」。",
    answer_html:
      "<p>這可能有兩種情況：<br>1. 您在頁面停留太久（超過10分鐘）沒有操作，系統自動斷線。請將瀏覽器整個關閉再重新登入。<br>2. 如果是特定功能（如EDI管理系統）出現此訊息，可能是安控元件問題，請至官網重新下載安裝。</p>",
    quick_actions: [{ text: "前往軟體下載", url: "/download" }],
  },
  {
    id: "SYS-04",
    category: "一般系統與操作問題",
    tags: ["轉圈圈", "沒有回應", "放行交易"],
    question: "我在放行交易或啟用憑證時，畫面一直轉圈圈沒有回應。",
    answer_html: "<p>您可以試著將讀卡機的USB接口拔掉後再重新插入，或將電腦重新開機，這通常可以解決問題。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-05",
    category: "一般系統與操作問題",
    tags: ["下載憑證", "交易處理中", "40-60秒"],
    question: "我下載憑證時，畫面一直停在「交易處理中，憑證作業約需40～60秒」轉圈圈。",
    answer_html:
      "<p>請您試試看：<br>1. 檢查您的讀卡機上是否有「確認」按鈕需要按下。<br>2. 先將企業網銀登出後再重新登入。<br>3. 將電腦重新開機後再操作一次。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-06",
    category: "一般系統與操作問題",
    tags: ["襄理", "放行", "IE瀏覽器", "F12"],
    question: "我是襄理，要放行轉帳時一直不成功，該怎麼辦？",
    answer_html:
      "<p>這可能是瀏覽器的相容性問題。如果您是使用IE瀏覽器，請在轉帳頁面按下鍵盤上的<strong>「F12」鍵，在下方出現的工具列中找到「模擬」頁籤，並將「文件模式」選擇為「IE11」</strong>，然後再重新進行放行操作。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-07",
    category: "一般系統與操作問題",
    tags: ["憑證服務", "空白", "防火牆", "8443 Port"],
    question: "我點選「憑證服務」時，畫面一片空白或顯示無法連線，怎麼辦？",
    answer_html:
      "<p>這通常是貴公司的網路防火牆設定阻擋了連線。請聯繫貴公司的資訊人員，請他們協助開放對 https://lbotpt.landbank.com.tw 這個網域的 8443 Port 的連線權限。</p>",
    quick_actions: [],
  },
  {
    id: "SYS-08",
    category: "一般系統與操作問題",
    tags: ["UX00999", "外匯網銀", "授權主管"],
    question: "使用外匯網銀時，出現「UX00999:尚未申請外匯網銀服務」。",
    answer_html:
      "<p>請先確認您登入的身分是否正確。例如，「授權主管」僅能進行管理設定，無法執行交易，若以主管身分操作交易功能，就會出現此訊息。</p>",
    quick_actions: [{ text: "前往企業網銀登入", url: "/login" }],
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const query = body?.query

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json({ error: "Query is missing" }, { status: 400 })
    }

    let foundAnswer = null

    for (const item of knowledgeBaseData) {
      // Check if any tag in the item matches the user query
      const hasMatch = item.tags.some(
        (tag) => query.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(query.toLowerCase()),
      )

      if (hasMatch) {
        foundAnswer = item
        break // Stop searching once we find a match
      }
    }

    if (foundAnswer) {
      return NextResponse.json({
        answer_html: foundAnswer.answer_html,
        quick_actions: foundAnswer.quick_actions,
        recommendations: foundAnswer.recommendations || [],
      })
    } else {
      return NextResponse.json({
        answer_html: "<p>抱歉，我暫時無法理解您的問題。您可以試著換個方式提問，或聯繫真人客服。</p>",
        quick_actions: [{ text: "聯絡客服", action: "show_contact" }],
        recommendations: [],
      })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 })
  }
}
