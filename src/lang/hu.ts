// hu.ts - hu translations
// WARNING: Auto-generated translations below. Please review and correct.
export default {
  SETTINGS_TAB_TITLE: 'Obsidian Python Bridge Beállítások',
  SETTINGS_FOLDER_TITLE: 'Python Szkriptek Mappája',
  SETTINGS_FOLDER_DESC:
    'A Python-szkripteket tartalmazó mappa elérési útja (abszolút vagy a vault-hoz képest relatív).',
  SETTINGS_FOLDER_PLACEHOLDER:
    '/elérési/út/a/szkriptekhez vagy ./scripts-python',
  SETTINGS_PORT_TITLE: 'HTTP Szerver Port',
  SETTINGS_PORT_DESC:
    'A helyi HTTP-szerver portja (1024-65535). Alkalmazásához újraindítás vagy a beállítások mentése szükséges.',
  SETTINGS_CACHE_TITLE: 'Python Gyorsítótár Letiltása (__pycache__)',
  SETTINGS_CACHE_DESC:
    'Futtassa a Pythont a "-B" kapcsolóval a .pyc fájlok írásának megakadályozásához.',
  NOTICE_PLUGIN_NAME: 'Python Bridge',
  NOTICE_PORT_CHANGED_PREFIX: 'HTTP port erre változott:',
  NOTICE_PORT_CHANGED_SUFFIX: 'Szerver újraindítása...',
  NOTICE_PYTHON_MISSING_TITLE: 'Python Bridge Hiba:',
  NOTICE_PYTHON_MISSING_DESC:
    'A Python végrehajtható fájl nem található a PATH-ban.\\nTelepítse a Pythont, és győződjön meg róla, hogy hozzá van adva a rendszer PATH környezeti változójához, hogy a bővítmény futtathassa a szkripteket.\\nA Python-t igénylő bővítményfunkciók nem lesznek elérhetők.',
  NOTICE_REQUESTS_MISSING_TITLE: 'Python Bridge Hiba:',
  NOTICE_REQUESTS_MISSING_DESC_PREFIX:
    "A szükséges Python könyvtár ('requests') nincs telepítve ehhez:",
  NOTICE_REQUESTS_MISSING_DESC_SUFFIX:
    '.\\nTelepítse a következő parancs futtatásával:\\n{pythonCmd} -m pip install requests\\nA Python-t igénylő bővítményfunkciók a telepítésig nem lesznek elérhetők.',
  NOTICE_INVALID_PORT_CONFIG_PREFIX: 'Érvénytelen HTTP port van beállítva:',
  NOTICE_INVALID_PORT_CONFIG_SUFFIX:
    'A szerver nem indult el. Kérjük, állítson be érvényes portot (1-65535) a beállításokban.',
  NOTICE_PORT_IN_USE_PREFIX: 'A(z)',
  NOTICE_PORT_IN_USE_SUFFIX:
    'port már használatban van. Kérjük, válasszon másik portot a beállításokban, vagy zárja be a portot használó másik alkalmazást. A szerver nem indult el.',
  NOTICE_SERVER_START_FAILED_PREFIX: 'Nem sikerült elindítani a szervert a(z)',
  NOTICE_SERVER_START_FAILED_SUFFIX: 'porton.',
  NOTICE_INVALID_PORT_RANGE:
    'Érvénytelen port. Kérjük, adjon meg egy számot 0 és 65535 között.',
  NOTICE_PORT_MISMATCH_WARNING_PREFIX:
    '⚠️ Python Bridge: HTTP port megváltozott (',
  NOTICE_PORT_MISMATCH_WARNING_MIDDLE: '->',
  NOTICE_PORT_MISMATCH_WARNING_SUFFIX:
    '). A szkript a régi portot célozhatja meg, ha már fut, vagy külsőleg lett elindítva.',
  NOTICE_SCRIPT_NOT_FOUND_PREFIX:
    'A Python szkript nem található, vagy nem fájl:',
  NOTICE_SCRIPT_ACCESS_ERROR_PREFIX: 'Hiba a szkriptfájl elérésekor:',
  NOTICE_RUNNING_SCRIPT_PREFIX: 'Python szkript futtatása:',
  NOTICE_SCRIPT_ERROR_RUNNING_PREFIX: 'Hiba a(z)',
  NOTICE_SCRIPT_ERROR_RUNNING_MIDDLE: 'futtatásakor ezzel:',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_MIDDLE: 'sikertelenül zárult a(z)',
  NOTICE_SCRIPT_FAILED_EXIT_CODE_SUFFIX:
    'kilépési kóddal. Ellenőrizze a konzolnaplókat.',
  NOTICE_PYTHON_EXEC_NOT_FOUND_PREFIX:
    'Nem található érvényes Python végrehajtható fájl. Próbálkozás:',
  NOTICE_PYTHON_EXEC_NOT_FOUND_SUFFIX:
    "Győződjön meg róla, hogy a Python telepítve van, és elérhető a rendszer PATH-ján keresztül (vagy a 'py' indítóval Windows-on).",
  NOTICE_SCRIPTS_FOLDER_INVALID:
    'A Python szkriptek mappája nem található vagy érvénytelen. Ellenőrizze a bővítmény beállításait.',
  NOTICE_SCRIPTS_FOLDER_READ_ERROR_PREFIX:
    'Hiba a szkriptek mappájának olvasásakor:',
  NOTICE_NO_SCRIPTS_FOUND:
    'Nem található Python szkript (.py) a beállított mappában.',
  NOTICE_RUNNING_ALL_SCRIPTS_PREFIX: 'Futtatás',
  NOTICE_RUNNING_ALL_SCRIPTS_SUFFIX: 'Python szkript...',
  NOTICE_INPUT_VALIDATION_FAILED:
    'A bevitel nem felel meg a szükséges formátumnak.',
  CMD_RUN_SPECIFIC_SCRIPT_NAME: 'Meghatározott Python szkript futtatása',
  CMD_RUN_ALL_SCRIPTS_NAME: 'Minden Python szkript futtatása a mappában',
  MODAL_USER_INPUT_SUBMIT_BUTTON: 'Küldés',
  MODAL_SELECT_SCRIPT_PLACEHOLDER:
    'Válasszon ki egy futtatandó Python szkriptet...',
  SETTINGS_SCRIPT_SETTINGS_TITLE: 'Szkript-specifikus Beállítások',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_NAME: 'Szkriptbeállítások Frissítése',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_DESC:
    'Vizsgálja át újra a szkriptek mappáját a Python szkriptekben definiált beállítások felfedezéséhez vagy frissítéséhez.',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_TEXT: 'Definíciók Frissítése',
  SETTINGS_REFRESH_DEFINITIONS_BUTTON_REFRESHING: 'Frissítés...',
  SETTINGS_SCRIPT_FOLDER_NOT_CONFIGURED:
    'A Python szkriptek mappája nincs beállítva. Kérjük, adja meg fent az elérési utat.',
  SETTINGS_NO_SCRIPT_SETTINGS_FOUND:
    "Nem található definiálható beállításokkal rendelkező szkript a beállított mappában, vagy a beállítások felfedezése sikertelen volt. Kattintson a 'Definíciók Frissítése' gombra az újbóli próbálkozáshoz.",
  SETTINGS_SCRIPT_SETTINGS_HEADING_PREFIX: 'Beállítások ehhez:',
  SETTINGS_LANGUAGE_AUTO: 'Automatikus (Obsidian alapján)',
  NOTICE_PYTHON_EXEC_MISSING_FOR_REFRESH:
    'Nem lehet frissíteni a beállításokat: A Python végrehajtható fájl nem található. Győződjön meg róla, hogy a Python telepítve van és a PATH-ban van.',
  NOTICE_REFRESHING_SCRIPT_SETTINGS:
    'Szkriptbeállítás-definíciók frissítése...',
  NOTICE_REFRESH_SCRIPT_SETTINGS_SUCCESS:
    'Szkriptbeállítás-definíciók sikeresen frissítve!',
  NOTICE_REFRESH_SCRIPT_SETTINGS_FAILED:
    'Nem sikerült frissíteni a szkriptbeállítás-definíciókat. Ellenőrizze a naplókat a részletekért.',
  NOTICE_PYTHON_EXEC_MISSING_FOR_RUN:
    'Nem lehet futtatni a szkriptet: A Python végrehajtható fájl nem található. Ellenőrizze a telepítést és a PATH-ot.',
  CMD_REFRESH_SCRIPT_SETTINGS_NAME:
    'Python szkriptbeállítás-definíciók frissítése',
  SETTINGS_SECURITY_WARNING_TITLE: 'Biztonsági Figyelmeztetés',
  SETTINGS_SECURITY_WARNING_TEXT:
    'Tetszőleges Python szkriptek futtatása kockázatos lehet. Győződjön meg róla, hogy megbízik a futtatott szkript forrásában, mivel azok hozzáférhetnek a rendszeréhez és adataihoz. A bővítmény szerzője és a szkriptek szerzői nem felelősek az Ön által futtatott szkriptek által okozott adatvesztésért vagy biztonsági problémákért. Futtassa a szkripteket saját felelősségére.',
  SETTINGS_LANGUAGE_TITLE: 'Bővítmény Nyelve',
  SETTINGS_LANGUAGE_DESC:
    "Válassza ki a Python Bridge bővítmény felületének megjelenítési nyelvét. Az 'Automatikus' az Obsidian nyelvi beállítását követi.",
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_TITLE:
    'Teljesítmény Tipp: Visszahivatkozás Gyorsítótár',
  SETTINGS_BACKLINK_CACHE_RECOMMENDATION_DESC:
    "A visszahivatkozások lekérésének (a get_backlinks funkció használatával) javított teljesítményéhez nagy tárolókban fontolja meg a @mnaoumov által készített '[Backlink Cache](https://github.com/mnaoumov/obsidian-backlink-cache)' közösségi bővítmény telepítését.",
  NOTICE_INVALID_FOLDER_PATH:
    'Érvénytelen mappa elérési út. Kérjük, válasszon érvényes mappát a beállításokban.',
  NOTICE_INVALID_STARTUP_FOLDER_PATH:
    "A beállított Python szkriptek mappa elérési útja ('{path}') érvénytelen vagy nem található. Beállítás törlése.",

  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_NAME: 'Szkript Engedélyezve',
  SETTINGS_SCRIPT_ACTIVATE_TOGGLE_DESC:
    "Engedélyezi a szkript végrehajtását parancsokkal, gyorsbillentyűkkel vagy az 'Összes futtatása' paranccsal.",
  NOTICE_SCRIPT_DISABLED:
    "A(z) '{scriptName}' szkript le van tiltva a beállításokban, és nem hajtható végre.",

  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_NAME: 'Futtatás indításkor',
  SETTINGS_SCRIPT_AUTOSTART_TOGGLE_DESC:
    "A szkript automatikus futtatása az Obsidian indításakor (csak akkor, ha a 'Szkript engedélyezve' is be van kapcsolva).",
  SETTINGS_SCRIPT_AUTOSTART_DELAY_NAME: 'Indítási késleltetés (másodperc)',
  SETTINGS_SCRIPT_AUTOSTART_DELAY_DESC:
    "Várjon ennyi másodpercet az Obsidian indítása után a szkript futtatása előtt (csak akkor érvényes, ha a 'Futtatás indításkor' be van kapcsolva). Használjon 0-t, ha nincs késleltetés.",

  SETTINGS_AUTO_PYTHONPATH_NAME:
    'PYTHONPATH automatikus beállítása a könyvtárhoz',
  SETTINGS_AUTO_PYTHONPATH_DESC:
    'Automatikusan hozzáadja a bővítménykönyvtárat a PYTHONPATH-hoz szkriptek futtatásakor, lehetővé téve a Python könyvtár közvetlen importálását (Ajánlott). Ha le van tiltva, át kell másolnia az ObsidianPluginDevPythonToJS.py fájlt a szkriptmappájába, vagy manuálisan kell kezelnie a sys.path-t.',
  NOTICE_AUTO_PYTHONPATH_DISABLED_DESC:
    'Automatikus PYTHONPATH letiltva. Győződjön meg róla, hogy az ObsidianPluginDevPythonToJS.py a szkriptmappájában van, vagy kezelje manuálisan a sys.path-t.',

  SETTINGS_PYTHON_EXEC_PATH_TITLE: 'Python Futtatható Fájl Elérési Útja',
  SETTINGS_PYTHON_EXEC_PATH_DESC:
    'Abszolút elérési út a Python vagy uv futtatható fájlhoz. Hagyja üresen az automatikus észleléshez (uv, py, python3, python). A bővítmény újraindítása vagy újratöltése szükséges a teljes hatálybalépéshez, ha megváltozik.',
  SETTINGS_PYTHON_EXEC_PATH_PLACEHOLDER:
    'pl. /usr/bin/python3 vagy C:Python39python.exe',
  NOTICE_PYTHON_EXEC_PATH_CHANGED_REFRESHING:
    'A Python futtatható fájl elérési útja megváltozott. Szkriptek frissítése...',
  NOTICE_PYTHON_EXEC_PATH_INVALID_NO_FALLBACK:
    'Az egyéni Python elérési út érvénytelen, és nem található tartalék futtatható fájl. A szkriptek möglicherweise nem futnak.',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_TITLE:
    'Egyéni Python Elérési Út Sikertelen',
  NOTICE_PYTHON_EXEC_PATH_CUSTOM_FAILED_DESC:
    "Az egyéni Python futtatható fájl elérési útja ('{path}') érvénytelen, vagy nem lehetett végrehajtani. Visszatérés az automatikus észleléshez.",

  // Activation Warning Modal
  ACTIVATION_WARNING_TITLE: 'Biztonsági Figyelmeztetés',
  ACTIVATION_WARNING_MESSAGE:
    'Az alábbi Python szkript engedélyezésére készül: "{scriptName}".',
  ACTIVATION_WARNING_RISK_FILES: 'Hozzáférés és fájlok módosítása a rendszerén',
  ACTIVATION_WARNING_RISK_NETWORK:
    'Hálózati kérések küldése külső szolgáltatásoknak',
  ACTIVATION_WARNING_RISK_SYSTEM:
    'Rendszerparancsok végrehajtása és rendszererőforrások elérése',
  ACTIVATION_WARNING_SECURITY_NOTE:
    'Csak olyan szkripteket engedélyezzen, amelyek forrásában megbízik. A bővítmény szerzője nem felelős a rosszindulatú szkriptek által okozott károkért.',
  ACTIVATION_WARNING_READMORE: 'Tudjon meg többet a biztonsági szempontokról',
  ACTIVATION_WARNING_CANCEL: 'Mégse',
  ACTIVATION_WARNING_ACTIVATE_ANYWAY: 'Engedélyezés Mindenképp',
};
