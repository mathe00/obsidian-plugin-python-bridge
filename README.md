# 🐍 Obsidian Python Bridge Plugin

<p align="center">
  <img src="logo.png" alt="Obsidian Python Bridge Logo" width="150">
</p>

## **💥 Develop [Obsidian plugins](https://obsidian.md/plugins) in [Python](https://www.python.org/)!**

Yes, you read that right! With this plugin, you can **develop plugins for Obsidian using Python**. 🎉 This is likely the **first plugin** that lets you directly integrate **Python scripts** into Obsidian to interact with your notes, retrieve metadata, display notifications, configure scripts via the UI, and so much more!

> Ever needed to build plugins for Obsidian but felt like JavaScript wasn't your cup of tea?
> With **Obsidian Python Bridge**, you can now use your favorite language, **Python**, to create plugins for Obsidian. 🙌

---

**Table of Contents**

-   [Description](#description)
    -   [Key Features](#key-features)
-   [🌍 Internationalization](#internationalization)
-   [Why this plugin? 🤔](#why-this-plugin)
    -   [Feature Highlight: Graphical `input()` in Obsidian via Modals! 🚀](#graphical-input-feature)
    -   [Feature Highlight: Script-Specific Settings in Obsidian UI! ⚙️](#script-settings-feature)
-   [Example of basic usage](#basic-usage)
-   [🚀 Future Features (roadmap)](#roadmap)
-   [🛠️ Installation](#installation)
-   [💖 Support the Project](#support)
-   [⭐ Show Your Support](#support)
-   [🛠️ Contributing](#contributing)
-   [⭐ Check out my other plugins](#other-plugins)
-   [License](#license)

---

<a id="description"></a>
## Description

💻 Developing **Obsidian plugins** without diving into **JavaScript**? Yes, that's possible with **Obsidian Python Bridge**. This plugin is designed specifically to **execute Python scripts** within Obsidian, and it comes with a **built-in Python library** to make your life easier.

**Cross-Platform Compatibility & Robustness (Windows, macOS, Linux):** As of **late April 2025**, the plugin uses a local HTTP server (listening only on `127.0.0.1` for security) instead of Unix sockets for communication. This makes the bridge **fully compatible with Windows, macOS, and Linux**! Furthermore, the plugin now **automatically detects your Python installation** (trying `py`, `python3`, and `python`) across all platforms, simplifying setup, especially on Windows. It also **performs checks on startup** to ensure Python is accessible and the required `requests` library is installed, **notifying you immediately** within Obsidian if there's an environment issue.

Some might think this plugin doesn't add much compared to running **external Python scripts**, but that's far from true. There are several key advantages:

#### What's easier with this plugin compared to external Python scripts:

-   **Editing the current note**:
    Without the plugin, you'd need to manually copy the path of the open `.md` file, then run your script in a terminal, pasting the path. This process is tedious and far from user-friendly.

-   **Detecting actions like note creation or deletion**:
    Yes, you can achieve this with an external Python script, but it requires constant monitoring, which adds complexity and clutters your code. With this plugin, such actions are handled more seamlessly.

-   **Retrieving frontmatter content as a clean dictionary**:
    While possible with pure Python, parsing YAML and organizing the data properly takes time and lines of code. With this plugin, it's done in **a single line**. 🙌

In short, while some tasks are technically feasible without this plugin, they're cumbersome, and this plugin makes them **much simpler and more user-friendly**.

<a id="key-features"></a>
### Key Features (What external Python scripts **cannot** easily do, but this plugin can):

-   **⚙️ Script-Specific Settings in Obsidian UI**: Define configuration options (like API keys, toggles, dropdowns, numbers) directly within your Python script. These settings automatically appear in the Obsidian "Python Bridge" settings tab, allowing users to configure your script's behavior without editing code. Your script can then easily retrieve the user-set values. This makes your Python scripts feel like native Obsidian plugins! (See highlight below)
-   **🚀 Graphical `input()` in Obsidian via Modals**: Create **modal dialogs** in Obsidian to collect data from the user directly within the interface, similar to Python's `input()` but graphical. (See highlight below)
-   **⌨️ Dynamic Commands & Shortcuts**: Automatically creates Obsidian commands for each executable Python script, allowing you to assign **keyboard shortcuts** directly to your favorite scripts.
-   **⏯️ Script Activation Control**: Enable or disable individual scripts directly from the plugin settings, preventing accidental execution.
-   **🔔 Native Obsidian Notifications**: Display notifications directly within Obsidian, making it more integrated and fluid compared to terminal outputs.
-   **📝 Access/Modify Active Note & Selection**: Easily get content, frontmatter, path, or title of the currently open note, and get or replace selected text in the editor. Get basic editor context (cursor position, line count).
-   **📂 Vault Interaction & File Management**: Get the vault path, list all notes, open specific notes, read/modify any note's content or frontmatter (by path). **Create, check existence, rename, delete notes and folders. List folder contents.** Get outgoing links from a note.
-   **🔗 Backlink Retrieval**: Get incoming links (backlinks) for a specific note. Optionally uses the [Backlink Cache plugin](https://github.com/mnaoumov/obsidian-backlink-cache) for significantly improved performance in large vaults if installed.
-   **ℹ️ Obsidian Context**: Get the current Obsidian language setting, vault name, and theme mode (light/dark).
-   **🛡️ Environment Checks & Guidance**: Automatically checks for Python and required libraries (`requests`, `PyYAML`) on startup and provides clear notifications if something is missing.
-   **💻 Cross-Platform**: Works reliably on Windows, macOS, and Linux thanks to HTTP communication and robust Python detection.
-   **🌐 Internationalized Interface**: Plugin UI (settings, commands, notices) available in multiple languages.

Thanks to the **Python library** (`ObsidianPluginDevPythonToJS.py`) I've developed, you can write ultra-minimalist scripts to interact with Obsidian. **No need to deal with JSON** or manage complex API calls—everything is neatly wrapped for you. 🤖 (Note: The Python library now requires the `requests` package, and `PyYAML` for frontmatter property management). **For easy importing, simply place the `ObsidianPluginDevPythonToJS.py` file in the same folder as your own Python scripts.**

👉 **For detailed instructions on how to use the Python library and its functions, including the new settings feature, please refer to the [Python Client Library Documentation](PYTHON_LIBRARY_DOCS.md).**

> **Note**: I'm **not a developer**, I just have solid experience with **Python**, and I get by with that. I know **nothing about JS**. This plugin was made **entirely with the help of AI assistants** (shoutout to **ChatGPT 4o**, **ChatGPT o1-preview**, and **Gemini 2.5 Pro** 😉). So, the code might be a bit rough around the edges, but it **works**. That's all that matters, right?

<a id="internationalization"></a>
## 🌍 Internationalization

This plugin aims to be accessible globally! The user interface (settings, commands, notices) is available in multiple languages.

*   **Automatic Detection:** By default, the plugin will try to match Obsidian's configured language.
*   **Manual Override:** You can select your preferred language for the plugin directly in the settings tab, regardless of Obsidian's language setting.
*   **Supported Languages (+30):**
    *   🇬🇧/🇺🇸 English (en)
    *   🇫🇷 French (fr)
    *   🇪🇸 Spanish (es)
    *   🇩🇪 German (de)
    *   🇨🇳 Chinese - Simplified (zh)
    *   🇸🇦 Arabic (ar)
    *   🇧🇷/🇵🇹 Portuguese (pt)
    *   🇷🇺 Russian (ru)
    *   🇯🇵 Japanese (ja)
    *   🇮🇳 Hindi (hi)
    *   🇰🇷 Korean (ko)
    *   🇮🇹 Italian (it)
    *   🇹🇷 Turkish (tr)
    *   🇮🇩 Indonesian (id)
    *   🇵🇱 Polish (pl)
    *   🇮🇳 Bengali (bn)
    *   🇵🇰/🇮🇳 Urdu (ur)
    *   🇻🇳 Vietnamese (vi)
    *   🇹🇭 Thai (th)
    *   🇵🇭 Filipino (fil)
    *   🇮🇷/🇦🇫/🇹🇯 Persian (Farsi) (fa)
    *   🇲🇾/🇧🇳/🇸🇬 Malay (ms)
    *   🇳🇱/🇧🇪 Dutch (nl)
    *   🇺🇦 Ukrainian (uk)
    *   🇬🇷 Greek (el)
    *   🇸🇪 Swedish (sv) *(representing Scandinavian)*
    *   🇫🇮 Finnish (fi)
    *   🇭🇺 Hungarian (hu)
    *   🇷🇴 Romanian (ro)
    *   🇨🇿 Czech (cs)
    *   🌍 Swahili (sw)
    *   🌍 Hausa (ha)
    *   🇳🇬 Yoruba (yo)
    *   🇳🇬 Igbo (ig)
    *   🇹🇼/🇭🇰 Chinese - Traditional (zht)

*(Phew! That's quite a list. If your language is *still* missing, feel free to open an issue or pull request, but I think we've covered a good chunk of the planet now! 😄)*

<a id="why-this-plugin"></a>
## Why this plugin? 🤔

I get it. Why add a layer between **Python** and **Obsidian** when everything can already be done in **JavaScript**?

Because, honestly, I **prefer Python**. And if I can write code faster and more efficiently with **Python**, without having to learn a whole new ecosystem (JavaScript/TypeScript), then why not?

**Obsidian Python Bridge** was created for people like me who prefer coding in **Python** and want to do things **quickly and effectively** in Obsidian. Sure, there are probably more "clean" or "optimized" ways to do this, but as long as it **works** and I understand what I'm doing, I'm happy. 😎

<a id="graphical-input-feature"></a>
### **Feature Highlight: Graphical `input()` in Obsidian via Modals!** 🚀

As of **October 2, 2024**, the **Obsidian Python Bridge** plugin allows you to create **graphical input modals** in Obsidian! This feature is similar to Python's native `input()` function but integrated into the Obsidian interface. Instead of inputting data through the terminal, you can now prompt users with **interactive pop-ups** directly inside Obsidian for text, numbers, booleans, dates, and more.

This feature opens up a wide range of possibilities, from collecting user data dynamically to creating more interactive scripts and workflows.

Here's a quick example to demonstrate how you can use this feature:

```python
# Import the Python-Obsidian bridge module
# Make sure 'requests' is installed: pip install requests
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError
import sys # Import sys to print errors to stderr

# NOTE: For scripts with settings, add define_settings() and _handle_cli_args() here

try:
    # Create an instance of the class (uses default/env port)
    obsidian = ObsidianPluginDevPythonToJS()

    # Request text input from the user
    response = obsidian.request_user_input(
        script_name="Text Input Example",
        input_type="text",
        message="Please enter your name:"
    )

    # Send a notification with the user's input
    if response is not None: # Check if user cancelled
        obsidian.show_notification(content=f"Hello {response}!")
    else:
        obsidian.show_notification(content="Input cancelled by user.")


except ObsidianCommError as e:
    print(f"Error communicating with Obsidian: {e}", file=sys.stderr)
except Exception as e:
    print(f"An unexpected error occurred: {e}", file=sys.stderr)

```

In this example, the script opens a **modal dialog** in Obsidian where the user can enter their name. After the user submits their input, a notification pops up displaying the entered text.

Here's an example of what the **modal** looks like:

![image](https://github.com/user-attachments/assets/bfdbc5b4-4838-47f0-af9b-c8bd46e534ff)
![image](https://github.com/user-attachments/assets/5947a81d-b414-4d38-95cf-60d9dba1677f)

As you can see, it's incredibly easy to set up and integrate into your Obsidian workflows.

<a id="script-settings-feature"></a>
### **Feature Highlight: Script-Specific Settings in Obsidian UI!** ⚙️

Tired of hardcoding API keys or configuration values in your scripts? Now you don't have to!

With the latest update, you can **define settings directly within your Python script**. Simply import the `define_settings` helper, create a list describing your settings (like text fields, toggles, dropdowns, number inputs), and register them.

```python
# Example snippet from your script
from ObsidianPluginDevPythonToJS import define_settings, _handle_cli_args

MY_SETTINGS = [
    { "key": "api_key", "type": "text", "label": "API Key", "default": "" },
    { "key": "enabled", "type": "toggle", "label": "Enable Feature", "default": True }
]
define_settings(MY_SETTINGS)
_handle_cli_args() # Handles discovery request from Obsidian

# ... later in your script ...
# obsidian = ObsidianPluginDevPythonToJS()
# settings = obsidian.get_script_settings()
# api_key = settings.get("api_key")
# feature_enabled = settings.get("enabled")
```

The **Obsidian Python Bridge** plugin will automatically **discover** these definitions and **display them in its settings tab** under a section for your script. Users can then configure these settings directly in the Obsidian interface, just like any other plugin!

Your script can then easily fetch the current values set by the user using the `obsidian.get_script_settings()` method. This makes your scripts much more flexible, user-friendly, and truly integrated into Obsidian. Check the [Python Client Library Documentation](PYTHON_LIBRARY_DOCS.md) for full details!

<a id="basic-usage"></a>
## Example of basic usage

This example shows basic interaction without script-specific settings. See the highlights above and the [Python Client Library Documentation](PYTHON_LIBRARY_DOCS.md) for examples using modals and settings.

```python
# Import the Python-Obsidian bridge module
# Make sure 'requests' is installed: pip install requests
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError
import sys

# NOTE: For scripts with settings, add define_settings() and _handle_cli_args() here

try:
    # Create an instance of the class (uses default/env port)
    obsidian = ObsidianPluginDevPythonToJS()

    # Test sending a notification
    obsidian.show_notification(content="Test notification: show_notification function", duration=5000)

    # Test retrieving the content of the active note
    note_content = obsidian.get_active_note_content()
    if note_content is not None:
        obsidian.show_notification(content=f"Note content: {note_content[:50]}...", duration=5000)  # Show the first 50 characters
    else:
        obsidian.show_notification(content="No active note found.", duration=3000)

    # Retrieving the absolute path of the active note
    absolute_path = obsidian.get_active_note_absolute_path()
    obsidian.show_notification(content=f"Absolute path: {absolute_path}", duration=5000)

    # Retrieving the relative path of the active note
    relative_path = obsidian.get_active_note_relative_path()
    obsidian.show_notification(content=f"Relative path: {relative_path}", duration=5000)

    # Retrieving the title of the active note
    title = obsidian.get_active_note_title()
    obsidian.show_notification(content=f"Title: {title}", duration=5000)

    # Retrieving the absolute path of the current vault
    vault_path = obsidian.get_current_vault_absolute_path()
    obsidian.show_notification(content=f"Vault path: {vault_path}", duration=5000)

    # Retrieving the frontmatter of the active note
    frontmatter = obsidian.get_active_note_frontmatter()
    obsidian.show_notification(content=f"Frontmatter: {frontmatter}", duration=5000)

except ObsidianCommError as e:
    print(f"Error communicating with Obsidian: {e}", file=sys.stderr)
except Exception as e:
    print(f"An unexpected error occurred: {e}", file=sys.stderr)

```

And here's a screenshot showing the results of the above code executed in the Obsidian environment:
![image](https://github.com/user-attachments/assets/49324d1d-02d3-414f-971d-820f05cbe23f)

In just a **few lines**, you can interact with your Obsidian vault, display notifications, and manipulate note metadata effectively and easily.

<a id="roadmap"></a>
## 🚀 Future Features (roadmap)

-   🛠️ **More Interactions with Obsidian**: Add more methods for interacting with Obsidian, like retrieving information on all notes, getting vault statistics, and more. *(Partially addressed: Added file management, context info, linking)*
-   🛠️ **Re-enable Disabled Features**: Fix build issues to re-enable `run_obsidian_command` and `get_all_tags`.
-   📦 **Refactoring**: If developers want to refactor the code to make it cleaner or more extensible, I'm open to it! 😅
-   📱 **Mobile Support (Highly Unlikely)**: Supporting mobile devices (iOS/Android) presents **significant technical challenges** due to OS limitations on executing external processes (like Python) and inter-app communication from within Obsidian's sandbox. While solutions involving environments like Termux (Android) might be theoretically explored, they would be extremely complex to implement reliably, require extensive user setup, and likely offer a subpar experience. Therefore, **mobile support is considered out of scope for this project's current architecture and is very unlikely to be implemented.**
-   📥 **Plugin Submission**: The plugin will be submitted to the Obsidian community plugins directory, making it easily downloadable from within Obsidian.

<a id="installation"></a>
## 🛠️ Installation

### Prerequisites

Before installing the plugin, please ensure you have the following installed on your system:

1.  **Python 3.x**: Make sure Python is installed and, crucially, that its executable (`python`, `python3`, or `py` on Windows) is accessible via your system's **PATH environment variable**. The plugin will try to find it automatically.
2.  **Python `requests` Library**: This plugin requires the `requests` library for HTTP communication. Install it using pip:
    ```bash
    pip install requests
    ```
    or if you use `python3` explicitly:
    ```bash
    python3 -m pip install requests
    ```
    *(The plugin will check for Python and `requests` on startup and notify you if either is missing.)*
3.  **Python `PyYAML` Library (Optional)**: Only needed if you use the `manage_properties_key` or `manage_properties_value` functions from the client library. Install via pip if needed:
    ```bash
    pip install PyYAML
    # or
    python3 -m pip install PyYAML
    ```

### Installation Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/mathe00/obsidian-plugin-python-bridge.git
    ```
2.  **Navigate into the project folder**:
    ```bash
    cd obsidian-plugin-python-bridge/
    ```
3.  **Install dependencies** (for the plugin build process):
    ```bash
    npm install
    ```
4.  **Build the project**:
    ```bash
    npm run build
    ```
    This will generate the `main.js` file needed by Obsidian.
5.  **Install the Plugin in Obsidian**:
    -   Create a new folder named `obsidian-python-bridge` inside your vault's plugin folder: `<your-vault>/.obsidian/plugins/`.
    -   Copy the generated `main.js` file and the `manifest.json` file from the project root into the newly created `<your-vault>/.obsidian/plugins/obsidian-python-bridge/` folder.
    -   **Restart Obsidian**.
    -   Go to **Settings** > **Community plugins**, find "Python Bridge" in the list of installed plugins (you might need to disable Safe Mode if it's your first time), and **enable it**.
6.  **Configure Plugin Settings**:
    -   In Obsidian, go to **Settings** > **Community plugins** > **Python Bridge** (click the gear icon).
    -   **(Important!) Security Warning**: Read the security warning at the top. Only run scripts you trust!
    -   **Plugin Language**: Choose your preferred language for the plugin interface, or select "Automatic" to follow Obsidian's language setting.
    -   Set the **Path to Python Scripts Folder**: Enter the **absolute path** or **vault-relative path** to the folder where you will store your Python scripts.
    -   Ensure the **HTTP Port** is set correctly (default is `27123`, 0 allows dynamic assignment).
    -   **Note on Multiple Vaults:** If you use this plugin in multiple Obsidian vaults simultaneously, you **must** configure a **unique HTTP Port** for each vault in its respective plugin settings to avoid conflicts. Your Python scripts will then need to target the correct port for the intended vault (the plugin sets the `OBSIDIAN_HTTP_PORT` environment variable to the *actual* listening port when running scripts).
    -   **(New!) Script-Specific Settings & Activation**: If you have scripts that define settings (using `define_settings`), click the "Refresh Definitions" button. Sections for your scripts should appear below, allowing you to configure them. **You can also enable or disable individual scripts using the toggle provided for each script.**
    -   **(New!) Performance Tip**: Note the recommendation regarding the [Backlink Cache plugin](https://github.com/mnaoumov/obsidian-backlink-cache) if you plan to use the `get_backlinks` feature frequently in large vaults.
7.  **Place the Python Library**:
    -   Download the `ObsidianPluginDevPythonToJS.py` file from this repository.
    -   **Crucially, place this `.py` file inside the Python scripts folder you configured in step 6.** This allows your scripts in that folder to easily `import ObsidianPluginDevPythonToJS`.

<a id="support-the-project"></a>
## 💖 Support the Project

If you've found this plugin saves you substantial time by letting you create Obsidian plugins in Python when you otherwise couldn't have (or wouldn't have wanted to) create them in JavaScript, consider making a small donation. I've personally spent dozens of hours developing this plugin through various technical challenges—all for free and largely not even for my own extensive personal use. Compared to the hours of work and frustration this plugin might save you, a small contribution goes a long way in supporting continued development and maintenance.

I currently accept donations through:

**Bitcoin**  
`zpub6nL6JpeLNPiK44KpPbBxQc8emSar7ZsbvLf1vbQsYmUAaHNj289i9q2XtE4H5cYLiFCxWSpWP88HBf7F75n34998LDutyHkdzKBJYxyMDoQ`

**Ethereum**  
`0xe0b8007dca71940ab09a2e025f111216f0eb1c4e`

If you have any questions about donations or encounter any issues, please feel free to open a GitHub issue. I'm available to respond to donation-related questions just like any other issue or feedback.

<a id="support"></a>
## ⭐ Show Your Support

If you find this plugin useful or interesting, feel free to give it a **star** on GitHub!
Or if you'd rather not, you can also drop by and say **hello** or provide feedback through **issues**.
I'm open to all kinds of feedback, advice, and encouragements! 😊

<a id="contributing"></a>
## 🛠️ Contributing

If you're a **developer** and you see ways to improve this plugin, I'm open to suggestions. I'm also always happy to welcome contributions!

As for me, as long as it works in **Python**, I'm satisfied. But if you see how to optimize or make the code **cleaner**, feel free to **submit your pull requests**!

I'm not an expert in **JavaScript** or **TypeScript**, but I'm learning and doing my best with the help of **AI assistants**. If you think this project is an odd mix of languages, I get it. But for me, it's a way to **create quickly** and **understand what I'm doing**.

<a id="other-plugins"></a>
## ⭐ Check out my other plugins

Feel free to check out my other plugins for Obsidian on my GitHub, like the **[Better Auto Linker](https://github.com/mathe00/obsidian-better-auto-linker-plugin)** or the **[Interactive Progress Bar Plugin](https://github.com/mathe00/obsidian-progress-bar-plugin)**. As always, they're **a bit rough** around the edges, but **they work**, and that's what matters in the end, right? 😅

<a id="license"></a>
## License

I've chosen the [MIT License](https://choosealicense.com/licenses/mit/) for this project because I believe in **freedom and open-source**.
If anyone has opinions on other licenses, feel free to share! I've been creating repos for about a week, so I'm still figuring things out as I go along. 😊

And yes, **JavaScript** is great too—let's not forget about it, even though this project is all about **Python**! 😄

---

**Thanks to everyone** who takes the time to test, contribute, or even just read this README! Together, we can turn this plugin into something truly useful for the Obsidian community. 💪
