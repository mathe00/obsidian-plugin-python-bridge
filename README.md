# 🐍 Obsidian Python Bridge Plugin

👋 **Welcome to the [Obsidian](https://obsidian.md/) Python Bridge plugin repository!**

### **💥 Develop [Obsidian plugins](https://obsidian.md/plugins) in Python!**

Yes, you read that right! With this plugin, you can **develop plugins for Obsidian using Python**. 🎉 This is likely the **first plugin** that lets you directly integrate **Python scripts** into Obsidian to interact with your notes, retrieve metadata, display notifications, and so much more!

> Ever needed to build plugins for Obsidian but felt like JavaScript wasn’t your cup of tea?  
> With **Obsidian Python Bridge**, you can now use your favorite language, **Python**, to create plugins for Obsidian. 🙌

---

### Description

💻 Developing **Obsidian plugins** without diving into **JavaScript**? Yes, that’s possible with **Obsidian Python Bridge**. This plugin is designed specifically to **execute Python scripts** within Obsidian, and it comes with a **built-in Python library** to make your life easier.

Typically, retrieving and manipulating information in Obsidian, such as **frontmatter**, **metadata**, or sending notifications, requires quite a bit of code (and in JS 😅). But with this plugin, you can do it in **just a few lines of Python**.

Thanks to the **Python library** I've developed, you can write ultra-minimalist scripts to interact with Obsidian. **No need to deal with JSON** or manage complex API calls—everything is neatly wrapped for you. 🤖

> **Note**: I'm **not a developer**, I just have solid experience with **Python**, and I get by with that. I know **nothing about JS**. This plugin was made **entirely with the help of ChatGPT** (shoutout to **ChatGPT 4o** and **ChatGPT o1-preview** 😉). So, the code might be a bit rough around the edges, but it **works**. That’s all that matters, right?

---

### 🚀 Available Features

- 🐍 **Develop Obsidian plugins in Python**: Create and run your own **Obsidian plugins** in Python, directly from Obsidian.
- 🔄 **Note Retrieval**: Get the content and metadata of active notes, neatly converted into **Python dictionaries**.
- 🔔 **Custom Notifications**: Send Obsidian notifications with a single line of Python.
- 🔧 **Flexible Settings**: Configure options like disabling Python cache (`__pycache__`), if needed.
- 📝 **Simplified Frontmatter**: Retrieve **frontmatter data** in a Python-friendly format, without the hassle of JSON manipulation.
- 🛠️ **Future Development: User Inputs**: We’re considering adding **pop-up windows in Obsidian** to allow users to input data for your Python scripts, just like they would in a terminal.

> **A whole new world of possibilities!** This plugin opens up an **universe of features** by enabling the development of actual **Obsidian plugins in Python**. By combining Obsidian's API with Python's flexibility, you can automate everything, create custom tools, and enhance your workflows like never before.

---

### Why this plugin? 🤔

I get it. Why add a layer between **Python** and **Obsidian** when everything can already be done in **JavaScript**?

Because, honestly, I **prefer Python**. And if I can write code faster and more efficiently with **Python**, without having to learn a whole new ecosystem (JS/TS), then why not?

**Obsidian Python Bridge** was created for people like me who prefer coding in **Python** and want to do things **quickly and effectively** in Obsidian. Sure, there are probably more "clean" or "optimized" ways to do this, but as long as it **works** and I understand what I’m doing, I’m happy. 😎

---

### Example of usage:

```python
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS

# Create an instance of the class
obsidian = ObsidianPluginDevPythonToJS()

# Test sending a notification
response = obsidian.send_notification(content="Test notification: send_notification function", duration=5000)

# Test retrieving the content of the active note
note_data = obsidian.get_active_note_content()
if "content" in note_data:
    obsidian.send_notification(content=f"Note content: {note_data['content'][:50]}...", duration=5000)  # Show the first 50 characters of the content
else:
    obsidian.send_notification(content="No active note found", duration=5000)

# Test retrieving the absolute path of the active note
absolute_path = obsidian.get_active_note_absolute_path()
obsidian.send_notification(content=f"Absolute path of the note: {absolute_path.get('absolutePath', 'Error retrieving')}", duration=5000)

# Test retrieving the relative path of the active note
relative_path = obsidian.get_active_note_relative_path()
obsidian.send_notification(content=f"Relative path of the note: {relative_path.get('relativePath', 'Error retrieving')}", duration=5000)

# Test retrieving the title of the active note
title = obsidian.get_active_note_title()
obsidian.send_notification(content=f"Title of the active note: {title.get('title', 'Error retrieving')}", duration=5000)

# Test retrieving the absolute path of the current vault
vault_path = obsidian.get_current_vault_absolute_path()
obsidian.send_notification(content=f"Absolute path of the vault: {vault_path.get('vaultPath', 'Error retrieving')}", duration=5000)

# Test retrieving the frontmatter of the active note
frontmatter = obsidian.get_active_note_frontmatter()
if frontmatter:
    obsidian.send_notification(content=f"Frontmatter: {frontmatter}", duration=5000)
else:
    obsidian.send_notification(content="No frontmatter found", duration=5000)
```

And here's a screenshot showing the results of the above code executed in the Obsidian environment:
![image](https://github.com/user-attachments/assets/49324d1d-02d3-414f-971d-820f05cbe23f)


In just a **few lines**, you can interact with your Obsidian vault, display notifications, and manipulate note metadata effectively and easily.

---

### 🚀 Future Features (roadmap)

- 🌐 **HTTP support for Windows**: Unix sockets don’t work on **Windows**, but **HTTP support** is in the works to enable seamless interaction on this platform.
- 📊 **User Input Management**: Display **pop-ups in Obsidian** to let users input data, similar to terminal inputs, for your Python scripts.
- 🛠️ **More Interactions with Obsidian**: Add more methods for interacting with Obsidian, like retrieving information on all notes, getting vault statistics, and more.
- 📦 **Refactoring**: If developers want to refactor the code to make it cleaner or more extensible, I’m open to it! 😅
- 📱 **Mobile Support (Future)**: There are long-term plans to potentially support mobile devices, though implementing this feature will be quite challenging.
- ⚙️ **Python Script Settings Integration**: We aim to enhance integration by allowing Python scripts to have their own settings sections within the plugin settings. This will help achieve a more "plugin-like" experience for Python scripts in Obsidian.
- 📥 **Plugin Submission**: The plugin will be submitted to the Obsidian community plugins directory, making it easily downloadable from within Obsidian.

---

### 🛠️ Installation

1. **Download** the `main.js`, `manifest.json`, and `styles.css` files from this repository.
2. **Create a folder** under `<your-vault>/.obsidian/plugins/obsidian-python-bridge/`.
3. **Place the downloaded files** into this folder.
4. **Restart Obsidian**.
5. Note that the plugin has **not yet been submitted** to the Obsidian community plugins directory, so you will need to enable it manually in **Settings** > **Community plugins**.
6. **Set up the script path**:  
   In the plugin settings, configure the **path to the folder** where your Python scripts will be located.
7. **Download the Python library** `ObsidianPluginDevPythonToJS.py`:  
   To use the ready-made functions and avoid re-writing complex JSON code each time, **download the `ObsidianPluginDevPythonToJS.py` file** from this repository and place it in **the same directory as your Python scripts**. This will allow you to **drastically reduce complexity** and make your scripts more minimalist and readable.

---

### ⭐ Show Your Support

If you find this plugin useful or interesting, feel free to give it a **star** on GitHub!  
Or if you’d rather not, you can also drop by and say **hello** or provide feedback through **issues**.  
I’m open to all kinds of feedback, advice, and encouragements! 😊

---

### 🛠️ Contributing

If you’re a **developer** and you see ways to improve this plugin, I’m open to suggestions. I’m also always happy to welcome contributions!

As for me, as long as it works in **Python**, I’m satisfied. But if you see how to optimize or make the code **cleaner**, feel free to **submit your pull requests**!

I’m not an expert in **JavaScript** or **TypeScript**, but I’m learning and doing my best with the help of **ChatGPT**. If you think this project is an odd mix of languages, I get it. But for me, it’s a way to **create quickly** and **understand what I’m doing**.

---

### ⭐ Check out my other plugins

Feel free to check out my other plugins for Obsidian on my GitHub, like the **Better Auto Linker** or the **Interactive Progress Bar Plugin**. As always, they’re **a bit rough** around the edges, but **they work**, and that’s what matters in the end, right? 😅

---

### License

I've chosen the **MIT License** for this project because I believe in **freedom and open-source**.  
If anyone has opinions on other licenses, feel free to share! I've been creating repos for about a week, so I’m still figuring things out as I go along. 😊

And yes, **JavaScript** is great too—let's not forget about it, even though this project is all about **Python**! 😄

---

**Thanks to everyone** who takes the time to test, contribute, or even just read this README! Together, we can turn this plugin into something truly useful for the Obsidian community. 💪
