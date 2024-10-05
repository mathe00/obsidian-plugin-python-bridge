**IMPORTANT NOTE 🚨 (October 2024): WE NEED DEVELOPERS, EVEN JUST A LITTLE HELP! THE PROJECT WILL PROGRESS VERY SLOWLY IF NO ONE WHO KNOWS A LITTLE TYPESCRIPT HELPS US OUT ON ONE OR MORE ISSUES!**

# 🐍 Obsidian Python Bridge Plugin

## **💥 Develop [Obsidian plugins](https://obsidian.md/plugins) in [Python](https://www.python.org/)!**

Yes, you read that right! With this plugin, you can **develop plugins for Obsidian using Python**. 🎉 This is likely the **first plugin** that lets you directly integrate **Python scripts** into Obsidian to interact with your notes, retrieve metadata, display notifications, and so much more!

> Ever needed to build plugins for Obsidian but felt like JavaScript wasn’t your cup of tea?  
> With **Obsidian Python Bridge**, you can now use your favorite language, **Python**, to create plugins for Obsidian. 🙌

## Description

💻 Developing **Obsidian plugins** without diving into **JavaScript**? Yes, that’s possible with **Obsidian Python Bridge**. This plugin is designed specifically to **execute Python scripts** within Obsidian, and it comes with a **built-in Python library** to make your life easier.

Some might think this plugin doesn’t add much compared to running **external Python scripts**, but that’s far from true. There are several key advantages:

#### What's easier with this plugin compared to external Python scripts:

- **Editing the current note**:  
  Without the plugin, you'd need to manually copy the path of the open `.md` file, then run your script in a terminal, pasting the path. This process is tedious and far from user-friendly.
  
- **Detecting actions like note creation or deletion**:  
  Yes, you can achieve this with an external Python script, but it requires constant monitoring, which adds complexity and clutters your code. With this plugin, such actions are handled more seamlessly.

- **Retrieving frontmatter content as a clean dictionary**:  
  While possible with pure Python, parsing YAML and organizing the data properly takes time and lines of code. With this plugin, it's done in **a single line**. 🙌

In short, while some tasks are technically feasible without this plugin, they’re cumbersome, and this plugin makes them **much simpler and more user-friendly**.

### What external Python scripts **cannot** do, but this plugin can:

- **Open pop-ups for user inputs** (GUI input equivalent to `input()` in Python):
  You can now create **modal dialogs** in Obsidian to collect data from the user directly within the interface.

- **Detect Obsidian-specific actions**:
  You can respond to user interactions with elements in Obsidian's UI, such as clicks on graphical components or specific actions within the vault.

- **Send native Obsidian notifications**:
  Display notifications directly within Obsidian, making it more integrated and fluid compared to terminal outputs.

- **Add custom settings for Python scripts**:  
  Soon, you’ll be able to include custom **settings for your Python scripts** directly in Obsidian’s settings panel, just like any other plugin. This was impossible before without this plugin.

- **And much more**:
  Many other features will be implemented over time, allowing deeper integration between Python and Obsidian.

Thanks to the **Python library** I've developed, you can write ultra-minimalist scripts to interact with Obsidian. **No need to deal with JSON** or manage complex API calls—everything is neatly wrapped for you. 🤖

> **Note**: I'm **not a developer**, I just have solid experience with **Python**, and I get by with that. I know **nothing about JS**. This plugin was made **entirely with the help of ChatGPT** (shoutout to **ChatGPT 4o** and **ChatGPT o1-preview** 😉). So, the code might be a bit rough around the edges, but it **works**. That’s all that matters, right?

## Why this plugin? 🤔

I get it. Why add a layer between **Python** and **Obsidian** when everything can already be done in **JavaScript**?

Because, honestly, I **prefer Python**. And if I can write code faster and more efficiently with **Python**, without having to learn a whole new ecosystem (JavaScript/TypeScript), then why not?

**Obsidian Python Bridge** was created for people like me who prefer coding in **Python** and want to do things **quickly and effectively** in Obsidian. Sure, there are probably more "clean" or "optimized" ways to do this, but as long as it **works** and I understand what I’m doing, I’m happy. 😎

### **New Feature: Graphical `input()` in Obsidian via Modals!** 🚀

As of **October 2, 2024**, the **Obsidian Python Bridge** plugin now allows you to create **graphical input modals** in Obsidian! This feature is similar to Python’s native `input()` function but integrated into the Obsidian interface. Instead of inputting data through the terminal, you can now prompt users with **interactive pop-ups** directly inside Obsidian.

This feature opens up a wide range of possibilities, from collecting user data dynamically to creating more interactive scripts and workflows.

Here’s a quick example to demonstrate how you can use this feature:

```python
# Import the Python-Obsidian bridge module
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS

# Request text input from the user
response = obsidian.request_user_input(script_name="Text Input",  input_type="text", message="Please enter your name:")

# Send a notification with the user's input
obsidian.send_notification(content=f"Hello {response['userInput']}!")
```

In this example, the script opens a **modal dialog** in Obsidian where the user can enter a note title. After the user submits their input, a notification pops up displaying the entered text.

Here’s an example of what the **modal** looks like:

![image](https://github.com/user-attachments/assets/bfdbc5b4-4838-47f0-af9b-c8bd46e534ff)
![image](https://github.com/user-attachments/assets/5947a81d-b414-4d38-95cf-60d9dba1677f)


As you can see, it’s incredibly easy to set up and integrate into your Obsidian workflows.

Feel free to expand this example or adjust it to fit your needs. This feature is ideal for collecting user input, manipulating notes based on input, or even customizing workflows within your vault.

## Example of basic usage:

```python
# Import the Python-Obsidian bridge module
from ObsidianPluginDevPythonToJS import ObsidianPluginDevPythonToJS

# Create an instance of the class
obsidian = ObsidianPluginDevPythonToJS()

# Test sending a notification
response = obsidian.send_notification(content="Test notification: send_notification function", duration=5000)

# Test retrieving the content of the active note
note_data = obsidian.get_active_note_content()
obsidian.send_notification(content=f"Note content: {note_data['content'][:50]}...", duration=5000)  # Show the first 50 characters of the content

# Rretrieving the absolute path of the active note
absolute_path = obsidian.get_active_note_absolute_path()
obsidian.send_notification(content=f"Absolute path of the note: {absolute_path.get('absolutePath', 'Error retrieving')}", duration=5000)

# Retrieving the relative path of the active note
relative_path = obsidian.get_active_note_relative_path()
obsidian.send_notification(content=f"Relative path of the note: {relative_path.get('relativePath', 'Error retrieving')}", duration=5000)

# Retrieving the title of the active note
title = obsidian.get_active_note_title()
obsidian.send_notification(content=f"Title of the active note: {title.get('title', 'Error retrieving')}", duration=5000)

# Retrieving the absolute path of the current vault
vault_path = obsidian.get_current_vault_absolute_path()
obsidian.send_notification(content=f"Absolute path of the vault: {vault_path.get('vaultPath', 'Error retrieving')}", duration=5000)

# Retrieving the frontmatter of the active note
frontmatter = obsidian.get_active_note_frontmatter()
obsidian.send_notification(content=f"Frontmatter: {frontmatter}", duration=5000)

```

And here's a screenshot showing the results of the above code executed in the Obsidian environment:
![image](https://github.com/user-attachments/assets/49324d1d-02d3-414f-971d-820f05cbe23f)


In just a **few lines**, you can interact with your Obsidian vault, display notifications, and manipulate note metadata effectively and easily.

## 🚀 Future Features (roadmap)

- 🌐 **HTTP support for Windows**: Unix sockets don’t work on **Windows**, but **HTTP support** is in the works to enable seamless interaction on this platform.
- 🛠️ **More Interactions with Obsidian**: Add more methods for interacting with Obsidian, like retrieving information on all notes, getting vault statistics, and more.
- 📦 **Refactoring**: If developers want to refactor the code to make it cleaner or more extensible, I’m open to it! 😅
- 📱 **Mobile Support (Future)**: There are long-term plans to potentially support mobile devices, though implementing this feature will be quite challenging.
- ⚙️ **Python Script Settings Integration**: We aim to enhance integration by allowing Python scripts to have their own settings sections within the plugin settings. This will help achieve a more "plugin-like" experience for Python scripts in Obsidian.
- 📥 **Plugin Submission**: The plugin will be submitted to the Obsidian community plugins directory, making it easily downloadable from within Obsidian.
- 🎨 **Creation of a new logo**: Create a logo that's a mix of Obsidian's and Python's.

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mathe00/obsidian-plugin-python-bridge.git
   ```
2. **Navigate into the project folder**:
   ```bash
   cd obsidian-plugin-python-bridge/
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```
   This will generate the `main.js` file.
5. **Follow these steps**:
   - **Create a folder** under `<your-vault>/.obsidian/plugins/obsidian-python-bridge/`.
   - **Place the generated `main.js` and `manifest.json` files** into this folder.
   - **Restart Obsidian**.
   - Since the plugin has **not yet been submitted** to the Obsidian community plugins directory, you will need to enable it manually in **Settings** > **Community plugins**.
   - **Set up the script path**:  
     In the plugin settings, configure the **path to the folder** where your Python scripts will be located.
   - **Download the Python library** `ObsidianPluginDevPythonToJS.py`:  
     To use pre-made functions and avoid rewriting complex JSON code, **download the `ObsidianPluginDevPythonToJS.py` file** from this repository and place it in **the same directory as your Python scripts**. This will help **simplify** your scripts and make them more readable.

## ⭐ Show Your Support

If you find this plugin useful or interesting, feel free to give it a **star** on GitHub!  
Or if you’d rather not, you can also drop by and say **hello** or provide feedback through **issues**.  
I’m open to all kinds of feedback, advice, and encouragements! 😊

## 🛠️ Contributing

If you’re a **developer** and you see ways to improve this plugin, I’m open to suggestions. I’m also always happy to welcome contributions!

As for me, as long as it works in **Python**, I’m satisfied. But if you see how to optimize or make the code **cleaner**, feel free to **submit your pull requests**!

I’m not an expert in **JavaScript** or **TypeScript**, but I’m learning and doing my best with the help of **ChatGPT**. If you think this project is an odd mix of languages, I get it. But for me, it’s a way to **create quickly** and **understand what I’m doing**.

## ⭐ Check out my other plugins

Feel free to check out my other plugins for Obsidian on my GitHub, like the **Better Auto Linker** or the **Interactive Progress Bar Plugin**. As always, they’re **a bit rough** around the edges, but **they work**, and that’s what matters in the end, right? 😅

## License

I've chosen the **MIT License** for this project because I believe in **freedom and open-source**.  
If anyone has opinions on other licenses, feel free to share! I've been creating repos for about a week, so I’m still figuring things out as I go along. 😊

And yes, **JavaScript** is great too—let's not forget about it, even though this project is all about **Python**! 😄

---

**Thanks to everyone** who takes the time to test, contribute, or even just read this README! Together, we can turn this plugin into something truly useful for the Obsidian community. 💪
