# --- obsidian_python_bridge/_frontmatter.py ---
"""
YAML frontmatter property management methods.

This mixin provides ``manage_properties_key`` and
``manage_properties_value`` for manipulating frontmatter keys and values
directly at the file level.  It requires **PyYAML** to be installed.

The two public methods share a lot of internal logic (reading/parsing the
frontmatter, reconstructing the note content, saving).  This has been
DRY-ed into three private helpers so that each method focuses purely on
its *action* semantics.
"""

from __future__ import annotations

import os
import sys
import traceback
from typing import Any

from ._exceptions import ObsidianCommError

# ---------------------------------------------------------------------------
# DRY helpers (module-level — no self needed)
# ---------------------------------------------------------------------------


def _read_and_parse_frontmatter(
    file_path: str,
    *,
    allow_create: bool = False,
) -> tuple[dict[str, Any] | None, str]:
    """Read a Markdown file and extract its YAML frontmatter.

    Args:
        file_path: Absolute path to the ``.md`` file.
        allow_create: If ``True`` and no frontmatter exists, return an
                      empty dict instead of ``None`` (useful for the
                      ``'add'`` action).

    Returns:
        A ``(frontmatter, main_content)`` tuple.  *frontmatter* is a
        ``dict`` if valid YAML frontmatter was found (or an empty dict
        when *allow_create* is ``True``), otherwise ``None``.  *main_content*
        is everything after the closing ``---`` delimiter.

    Raises:
        ValueError: If the file is not a ``.md`` file, not absolute, or
                    doesn't exist.
    """
    if not os.path.isfile(file_path) or not file_path.endswith(".md"):
        raise ValueError(f"Invalid file path or not a .md file: {file_path}")
    if not os.path.isabs(file_path):
        raise ValueError(f"File path must be absolute: {file_path}")

    with open(file_path, encoding="utf-8") as fh:
        content = fh.read()

    parts = content.split("---", 2)
    if len(parts) < 3 or parts[0].strip() != "":
        # No valid frontmatter block found
        if allow_create:
            return {}, content
        return None, content

    yaml_str = parts[1]
    main_content = parts[2]

    try:
        import yaml
    except ImportError as exc:
        raise NameError("PyYAML is required for frontmatter management. Install it (`pip install PyYAML`).") from exc

    loaded = yaml.safe_load(yaml_str) or {}
    if not isinstance(loaded, dict):
        return None, content
    return loaded, main_content


def _reconstruct_note(frontmatter: dict[str, Any] | None, main_content: str) -> str:
    """Reassemble a full Markdown file from frontmatter + body content.

    If *frontmatter* is empty/``None`` the ``---`` delimiters are omitted.

    Args:
        frontmatter: Parsed frontmatter dict (may be empty).
        main_content: The note body after the closing ``---``.

    Returns:
        The complete file content string.
    """
    if not frontmatter:
        return main_content.lstrip()

    import yaml

    yaml_str = yaml.dump(
        frontmatter,
        allow_unicode=True,
        sort_keys=False,
        default_flow_style=False,
    ).strip()
    separator = "\n" if main_content else ""
    return f"---\n{yaml_str}\n---{separator}{main_content}"


def _save_note(
    file_path: str,
    updated_content: str,
    *,
    use_vault_modify: bool,
    modify_fn: Any,
) -> dict[str, Any]:
    """Persist note content either via the Obsidian API or direct write.

    Args:
        file_path: Absolute path to the note.
        updated_content: The full file content to write.
        use_vault_modify: If ``True``, use the Obsidian HTTP API;
                          otherwise write directly to disk (risky).
        modify_fn: The bound ``modify_note_content`` method on the client
                   instance, used when *use_vault_modify* is ``True``.

    Returns:
        ``{"success": True}`` on success, or
        ``{"success": False, "error": "..."}`` on failure.
    """
    if use_vault_modify:
        try:
            modify_fn(file_path, updated_content)
        except ObsidianCommError as e:
            return {"success": False, "error": f"Obsidian API error during save: {e}"}
    else:
        try:
            with open(file_path, "w", encoding="utf-8") as fh:
                fh.write(updated_content)
        except OSError as e:
            return {"success": False, "error": f"Direct file write failed: {e}"}

    return {"success": True}


# ---------------------------------------------------------------------------
# Mixin
# ---------------------------------------------------------------------------


class FrontmatterMixin:
    """Mixin: YAML frontmatter key and value management.

    Requires the host class to expose ``modify_note_content(file_path, content)``.
    """

    # ------------------------------------------------------------------
    # Key-level management
    # ------------------------------------------------------------------

    def manage_properties_key(  # type: ignore[misc]
        self,
        file_path: str,
        action: str,
        key: str | None = None,
        new_key: str | None = None,
        use_vault_modify: bool = True,
    ) -> dict[str, Any]:
        """Manage top-level keys in a note's YAML frontmatter.

        Args:
            file_path: Absolute path to the ``.md`` file.
            action: ``'add'``, ``'remove'``, or ``'rename'``.
            key: Key to act upon (required).
            new_key: New key name for ``'rename'``.
            use_vault_modify: Use Obsidian API (``True``) or direct write.

        Returns:
            ``{'success': True}`` or ``{'success': False, 'error': '...'}``.
        """
        # --- Validate file path ---
        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {"success": False, "error": f"Invalid file path or not a .md file: {file_path}"}
        if not os.path.isabs(file_path):
            return {"success": False, "error": f"File path must be absolute: {file_path}"}

        # --- Validate action & parameters ---
        if action not in ("add", "remove", "rename"):
            return {"success": False, "error": f"Invalid action '{action}'. Must be 'add', 'remove', or 'rename'."}
        if not key:
            return {"success": False, "error": "'key' argument is required."}
        if action == "rename" and not new_key:
            return {"success": False, "error": "'new_key' argument is required for 'rename'."}

        try:
            allow_create = action == "add"
            fm = _read_and_parse_frontmatter(file_path, allow_create=allow_create)

            # _read_and_parse_frontmatter returns None when no frontmatter and !allow_create
            if fm is None:
                return {
                    "success": False,
                    "error": "Could not find valid YAML frontmatter block (---) at the start of the file.",
                }

            frontmatter: dict[str, Any] = fm
            main_content: str = ""  # type: ignore[assignment]
            # Re-read to get main_content (the helper returns it)
            frontmatter, main_content = _read_and_parse_frontmatter(file_path, allow_create=allow_create)
            if frontmatter is None:  # pragma: no cover — safety guard
                return {"success": False, "error": "Unexpected: frontmatter is None after allow_create."}

            original = frontmatter.copy()

            # --- Perform action ---
            if action == "add":
                if key in frontmatter:
                    return {"success": False, "error": f"Cannot add key '{key}': Key already exists."}
                frontmatter[key] = None

            elif action == "remove":
                if key not in frontmatter:
                    return {"success": False, "error": f"Cannot remove key '{key}': Key not found."}
                del frontmatter[key]

            elif action == "rename":
                if key not in frontmatter:
                    return {"success": False, "error": f"Cannot rename key '{key}': Key not found."}
                if new_key == key:
                    return {"success": False, "error": "Cannot rename key: new_key is the same as the old key."}
                if new_key in frontmatter:
                    return {"success": False, "error": f"Cannot rename to '{new_key}': Target key already exists."}
                frontmatter[new_key] = frontmatter.pop(key)

            # --- Reconstruct and save if changed ---
            if frontmatter == original:
                return {"success": True, "message": "No changes needed."}

            updated_content = _reconstruct_note(frontmatter, main_content)
            return _save_note(
                file_path,
                updated_content,
                use_vault_modify=use_vault_modify,
                modify_fn=self.modify_note_content,  # type: ignore[attr-defined]
            )

        except NameError as e:
            return {"success": False, "error": str(e)}
        except ValueError as e:
            return {"success": False, "error": str(e)}
        except ObsidianCommError as e:
            return {"success": False, "error": f"Obsidian API error during save: {e}"}
        except Exception as e:
            print(
                f"ERROR: Unexpected error in manage_properties_key: {e}\n{traceback.format_exc()}",
                file=sys.stderr,
            )
            return {"success": False, "error": f"An unexpected error occurred: {e}"}

    # ------------------------------------------------------------------
    # Value-level management
    # ------------------------------------------------------------------

    def manage_properties_value(  # type: ignore[misc]
        self,
        file_path: str,
        key: str,
        action: str,
        value: Any = None,
        new_value: Any = None,
        index: int | None = None,
        use_vault_modify: bool = True,
    ) -> dict[str, Any]:
        """Manage values associated with a key in YAML frontmatter.

        Args:
            file_path: Absolute path to the ``.md`` file.
            key: The frontmatter key to manage.
            action: ``'add'``, ``'remove'``, or ``'update'``.
            value: Value to add/remove, or old value for list update.
            new_value: New value for ``'update'``.
            index: Index for list update.
            use_vault_modify: Use Obsidian API (``True``) or direct write.

        Returns:
            ``{'success': True}`` or ``{'success': False, 'error': '...'}``.
        """
        # --- Validate file path ---
        if not os.path.isfile(file_path) or not file_path.endswith(".md"):
            return {"success": False, "error": f"Invalid file path or not a .md file: {file_path}"}
        if not os.path.isabs(file_path):
            return {"success": False, "error": f"File path must be absolute: {file_path}"}
        if not key:
            return {"success": False, "error": "'key' argument is required."}
        if action not in ("add", "remove", "update"):
            return {"success": False, "error": f"Invalid action '{action}'. Must be 'add', 'remove', or 'update'."}

        try:
            allow_create = action == "add"
            fm = _read_and_parse_frontmatter(file_path, allow_create=allow_create)

            if fm is None:
                return {
                    "success": False,
                    "error": f"Key '{key}' not found (no frontmatter) for action '{action}'.",
                }

            frontmatter: dict[str, Any] = fm
            # Re-read to get main_content
            frontmatter, main_content = _read_and_parse_frontmatter(file_path, allow_create=allow_create)
            if frontmatter is None:  # pragma: no cover — safety guard
                return {"success": False, "error": "Unexpected: frontmatter is None after allow_create."}

            # Key existence check (except for 'add')
            if key not in frontmatter and action != "add":
                return {"success": False, "error": f"Key '{key}' not found in frontmatter for action '{action}'."}

            original = frontmatter.copy()

            # --- Perform action ---
            if action == "add":
                if key not in frontmatter:
                    frontmatter[key] = value
                elif isinstance(frontmatter[key], list):
                    items_to_add = value if isinstance(value, list) else [value]
                    frontmatter[key].extend(items_to_add)
                elif frontmatter[key] is None:
                    frontmatter[key] = value
                else:
                    return {
                        "success": False,
                        "error": f"Cannot add value: Key '{key}' exists but is not a list or null "
                        f"(type: {type(frontmatter[key]).__name__}). Use 'update' to change scalar values.",
                    }

            elif action == "remove":
                current = frontmatter.get(key)
                if isinstance(current, list):
                    items_to_remove = value if isinstance(value, list) else [value]
                    original_length = len(current)
                    new_list = [item for item in current if item not in items_to_remove]
                    if len(new_list) == original_length:
                        err = f"Value(s) '{items_to_remove}' not found in list for '{key}'."
                        return {"success": False, "error": err}
                    frontmatter[key] = new_list
                elif current == value:
                    del frontmatter[key]
                else:
                    return {
                        "success": False,
                        "error": f"Cannot remove value: Key '{key}' is not a list, and its value "
                        f"('{current}') does not match ('{value}').",
                    }

            elif action == "update":
                current = frontmatter.get(key)
                if isinstance(current, list):
                    if index is not None:
                        if not isinstance(index, int):
                            return {"success": False, "error": "Index must be an integer."}
                        if not (-len(current) <= index < len(current)):
                            err = f"Index {index} is out of bounds for list key '{key}' (length {len(current)})."
                            return {"success": False, "error": err}
                        current[index] = new_value
                    elif value is not None:
                        try:
                            idx = current.index(value)
                            current[idx] = new_value
                        except ValueError:
                            err = f"Value '{value}' to update not found in list key '{key}'."
                            return {"success": False, "error": err}
                    else:
                        return {
                            "success": False,
                            "error": "For list update, provide either 'index' or the old 'value' to replace.",
                        }
                else:
                    frontmatter[key] = new_value

            # --- Reconstruct and save if changed ---
            if frontmatter == original:
                return {"success": True, "message": "No changes needed."}

            updated_content = _reconstruct_note(frontmatter, main_content)
            return _save_note(
                file_path,
                updated_content,
                use_vault_modify=use_vault_modify,
                modify_fn=self.modify_note_content,  # type: ignore[attr-defined]
            )

        except NameError as e:
            return {"success": False, "error": str(e)}
        except ValueError as e:
            return {"success": False, "error": str(e)}
        except ObsidianCommError as e:
            return {"success": False, "error": f"Obsidian API error during save: {e}"}
        except Exception as e:
            print(
                f"ERROR: Unexpected error in manage_properties_value: {e}\n{traceback.format_exc()}",
                file=sys.stderr,
            )
            return {"success": False, "error": f"An unexpected error occurred: {e}"}
