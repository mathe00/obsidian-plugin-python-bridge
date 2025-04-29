# 🐍 Obsidian Python Bridge Plugin

<p align="center">
  <img src="logo.png" alt="Obsidian Python Bridge Logo" width="150">
</p>

## **💥 Develop [Obsidian plugins](https://obsidian.md/plugins) in [Python](https://www.python.org/)!**

Yes, you read that right! With this plugin, you can **develop plugins for Obsidian using Python**. 🎉 This is likely the **first plugin** that lets you directly integrate **Python scripts** into Obsidian to interact with your notes, retrieve metadata, display notifications, and so much more!

> Ever needed to build plugins for Obsidian but felt like JavaScript wasn’t your cup of tea?
> With **Obsidian Python Bridge**, you can now use your favorite language, **Python**, to create plugins for Obsidian. 🙌

---

**Table of Contents**

-   [Description](#description)
-   [🌍 Internationalization](#internationalization)
-   [Why this plugin? 🤔](#why-this-plugin)
    -   [New Feature: Graphical `input()` in Obsidian via Modals! 🚀](#graphical-input-feature)
-   [Example of basic usage](#basic-usage)
-   [🚀 Future Features (roadmap)](#roadmap)
-   [🛠️ Installation](#installation)
-   [⭐ Show Your Support](#support)
-   [🛠️ Contributing](#contributing)
-   [⭐ Check out my other plugins](#other-plugins)
-   [License](#license)

---

<a id="description"></a>
## Description

💻 Developing **Obsidian plugins** without diving into **JavaScript**? Yes, that’s possible with **Obsidian Python Bridge**. This plugin is designed specifically to **execute Python scripts** within Obsidian, and it comes with a **built-in Python library** to make your life easier.

**Cross-Platform Compatibility & Robustness (Windows, macOS, Linux):** As of **late April 2025**, the plugin uses a local HTTP server (listening only on `127.0.0.1` for security) instead of Unix sockets for communication. This makes the bridge **fully compatible with Windows, macOS, and Linux**! Furthermore, the plugin now **automatically detects your Python installation** (trying `py`, `python3`, and `python`) across all platforms, simplifying setup, especially on Windows. It also **performs checks on startup** to ensure Python is accessible and the required `requests` library is installed, **notifying you immediately** within Obsidian if there's an environment issue.

Some might think this plugin doesn’t add much compared to running **external Python scripts**, but that’s far from true. There are several key advantages:

#### What's easier with this plugin compared to external Python scripts:

-   **Editing the current note**:
    Without the plugin, you'd need to manually copy the path of the open `.md` file, then run your script in a terminal, pasting the path. This process is tedious and far from user-friendly.

-   **Detecting actions like note creation or deletion**:
    Yes, you can achieve this with an external Python script, but it requires constant monitoring, which adds complexity and clutters your code. With this plugin, such actions are handled more seamlessly.

-   **Retrieving frontmatter content as a clean dictionary**:
    While possible with pure Python, parsing YAML and organizing the data properly takes time and lines of code. With this plugin, it's done in **a single line**. 🙌

In short, while some tasks are technically feasible without this plugin, they’re cumbersome, and this plugin makes them **much simpler and more user-friendly**.

### What external Python scripts **cannot** do, but this plugin can:

-   **Open pop-ups for user inputs** (GUI input equivalent to `input()` in Python):
    You can now create **modal dialogs** in Obsidian to collect data from the user directly within the interface.

-   **Detect Obsidian-specific actions**:
    You can respond to user interactions with elements in Obsidian's UI, such as clicks on graphical components or specific actions within the vault.

-   **Send native Obsidian notifications**:
    Display notifications directly within Obsidian, making it more integrated and fluid compared to terminal outputs.

-   **Add custom settings for Python scripts**:
    Soon, you’ll be able to include custom **settings for your Python scripts** directly in Obsidian’s settings panel, just like any other plugin. This was impossible before without this plugin.

-   **And much more**:
    Many other features will be implemented over time, allowing deeper integration between Python and Obsidian.

Thanks to the **Python library** (`ObsidianPluginDevPythonToJS.py`) I've developed, you can write ultra-minimalist scripts to interact with Obsidian. **No need to deal with JSON** or manage complex API calls—everything is neatly wrapped for you. 🤖 (Note: The Python library now requires the `requests` package). **For easy importing, simply place the `ObsidianPluginDevPythonToJS.py` file in the same folder as your own Python scripts.**

> **Note**: I'm **not a developer**, I just have solid experience with **Python**, and I get by with that. I know **nothing about JS**. This plugin was made **entirely with the help of AI assistants** (shoutout to **ChatGPT 4o**, **ChatGPT o1-preview**, and **Gemini 2.5 Pro** 😉). So, the code might be a bit rough around the edges, but it **works**. That’s all that matters, right?

<a id="internationalization"></a>
## 🌍 Internationalization

This plugin aims to be accessible globally! The user interface (settings, commands, notices) is available in multiple languages.

*   **Automatic Detection:** By default, the plugin will try to match Obsidian's configured language.
*   **Manual Override:** You can select your preferred language for the plugin directly in the settings tab, regardless of Obsidian's language setting.
*   **Supported Languages:**
    *   🇬🇧/🇺🇸 English (en)
    *   🇫🇷 French (fr)
    *   🇪🇸 Spanish (es)
    *   🇩🇪 German (de)
    *   🇨🇳 Chinese (zh)
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

*(Want to contribute translations for another language? Feel free to open an issue or pull request!)*

<a id="why-this-plugin"></a>
## Why this plugin? 🤔

I get it. Why add a layer between **Python** and **Obsidian** when everything can already be done in **JavaScript**?

Because, honestly, I **prefer Python**. And if I can write code faster and more efficiently with **Python**, without having to learn a whole new ecosystem (JavaScript/TypeScript), then why not?

**Obsidian Python Bridge** was created for people like me who prefer coding in **Python** and want to do things **quickly and effectively** in Obsidian. Sure, there are probably more "clean" or "optimized" ways to do this, but as long as it **works** and I understand what I’m doing, I’m happy. 😎

<a id="graphical-input-feature"></a>
### **New Feature: Graphical `input()` in Obsidian via Modals!** 🚀

As of **October 2, 2024**, the **Obsidian Python Bridge** plugin now allows you to create **graphical input modals** in Obsidian! This feature is similar to Python’s native `input()` function but integrated into the Obsidian interface. Instead of inputting data through the terminal, you can now prompt users with **interactive pop-ups** directly inside Obsidian.

This feature opens up a wide range of possibilities, from collecting user data dynamically to creating more interactive scripts and workflows.

Here’s a quick example to demonstrate how you can use this feature:

```python
# Import the Python-Obsidian bridge module
# Make sure 'requests' is installed: pip install requests
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError
import sys # Import sys to print errors to stderr

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

In this example, the script opens a **modal dialog** in Obsidian where the user can enter a note title. After the user submits their input, a notification pops up displaying the entered text.

Here’s an example of what the **modal** looks like:

![image](https://github.com/user-attachments/assets/bfdbc5b4-4838-47f0-af9b-c8bd46e534ff)
![image](https://github.com/user-attachments/assets/5947a81d-b414-4d38-95cf-60d9dba1677f)

As you can see, it’s incredibly easy to set up and integrate into your Obsidian workflows.

Feel free to expand this example or adjust it to fit your needs. This feature is ideal for collecting user input, manipulating notes based on input, or even customizing workflows within your vault.

<a id="basic-usage"></a>
## Example of basic usage

```python
# Import the Python-Obsidian bridge module
# Make sure 'requests' is installed: pip install requests
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS, ObsidianCommError
import sys

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

-   🌍 **More Languages**: Add support for even more languages (contributions welcome!).
-   🛠️ **More Interactions with Obsidian**: Add more methods for interacting with Obsidian, like retrieving information on all notes, getting vault statistics, and more.
-   📦 **Refactoring**: If developers want to refactor the code to make it cleaner or more extensible, I’m open to it! 😅
-   📱 **Mobile Support (Future)**: There are long-term plans to potentially support mobile devices, though implementing this feature will be quite challenging.
-   ⚙️ **Python Script Settings Integration**: We aim to enhance integration by allowing Python scripts to have their own settings sections within the plugin settings. This will help achieve a more "plugin-like" experience for Python scripts in Obsidian.
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
    -   **Plugin Language**: Choose your preferred language for the plugin interface, or select "Automatic" to follow Obsidian's language setting.
    -   Set the **Path to Python Scripts Folder**: Enter the **absolute path** or **vault-relative path** to the folder where you will store your Python scripts.
    -   Ensure the **HTTP Port** is set correctly (default is `27123`).
    -   **Note on Multiple Vaults:** If you use this plugin in multiple Obsidian vaults simultaneously, you **must** configure a **unique HTTP Port** for each vault in its respective plugin settings to avoid conflicts. Your Python scripts will then need to target the correct port for the intended vault (either by setting the `OBSIDIAN_HTTP_PORT` environment variable or by passing the `http_port` argument when creating the `ObsidianPluginDevPythonToJS` instance).
7.  **Place the Python Library**:
    -   Download the `ObsidianPluginDevPythonToJS.py` file from this repository.
    -   **Crucially, place this `.py` file inside the Python scripts folder you configured in step 6.** This allows your scripts in that folder to easily `import ObsidianPluginDevPythonToJS`.

<a id="support"></a>
## ⭐ Show Your Support

If you find this plugin useful or interesting, feel free to give it a **star** on GitHub!
Or if you’d rather not, you can also drop by and say **hello** or provide feedback through **issues**.
I’m open to all kinds of feedback, advice, and encouragements! 😊

<a id="contributing"></a>
## 🛠️ Contributing

If you’re a **developer** and you see ways to improve this plugin, I’m open to suggestions. I’m also always happy to welcome contributions!

As for me, as long as it works in **Python**, I’m satisfied. But if you see how to optimize or make the code **cleaner**, feel free to **submit your pull requests**!

I’m not an expert in **JavaScript** or **TypeScript**, but I’m learning and doing my best with the help of **AI assistants**. If you think this project is an odd mix of languages, I get it. But for me, it’s a way to **create quickly** and **understand what I’m doing**.

<a id="other-plugins"></a>
## ⭐ Check out my other plugins

Feel free to check out my other plugins for Obsidian on my GitHub, like the **[Better Auto Linker](https://github.com/mathe00/obsidian-better-auto-linker-plugin)** or the **[Interactive Progress Bar Plugin](https://github.com/mathe00/obsidian-progress-bar-plugin)**. As always, they’re **a bit rough** around the edges, but **they work**, and that’s what matters in the end, right? 😅

<a id="license"></a>
## License

I've chosen the [MIT License](https://choosealicense.com/licenses/mit/) for this project because I believe in **freedom and open-source**.
If anyone has opinions on other licenses, feel free to share! I've been creating repos for about a week, so I’m still figuring things out as I go along. 😊

And yes, **JavaScript** is great too—let's not forget about it, even though this project is all about **Python**! 😄

---

**Thanks to everyone** who takes the time to test, contribute, or even just read this README! Together, we can turn this plugin into something truly useful for the Obsidian community. 💪
