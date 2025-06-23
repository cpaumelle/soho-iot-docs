# UI Versioning Workflow: `ui-iterations-copy-to-next-version.md`

This document outlines the automated process for managing UI versions, allowing for safe and rapid development while maintaining stable production environments.

---

## What Happens During Version Creation

The `./create-ui-version.sh` script automates the following key steps:

* **Copies all files** from the specified source version to the new version's directory.
* **Updates version badges** (e.g., `V2` → `V3`) across all relevant HTML files.
* **Adds routing entries** to the `Caddyfile`, ensuring the new version is accessible.
* **Restarts Caddy** to apply the new routing configurations immediately.
* **Tests accessibility** of the newly created version.
* **Generates initial documentation** for the new UI version.

---

## File Structure

The UI versions are organized in a clear, hierarchical structure:
~/iot/ui-versions/
├── v1/src/          # Stable production version
├── v2/src/          # Enhanced version with improvements
├── v3/src/          # New development version
└── v4/src/          # Future version
Got it! Here is the content formatted with pure GitHub Flavored Markdown (GFM) syntax. You can directly copy and paste this into a .md file in the GitHub editor, and it will render just as described, with all the beautiful formatting.

Markdown

# UI Versioning Workflow: `ui-iterations-copy-to-next-version.md`

This document outlines the automated process for managing UI versions, allowing for safe and rapid development while maintaining stable production environments.

---

## What Happens During Version Creation

The `./create-ui-version.sh` script automates the following key steps:

* **Copies all files** from the specified source version to the new version's directory.
* **Updates version badges** (e.g., `V2` → `V3`) across all relevant HTML files.
* **Adds routing entries** to the `Caddyfile`, ensuring the new version is accessible.
* **Restarts Caddy** to apply the new routing configurations immediately.
* **Tests accessibility** of the newly created version.
* **Generates initial documentation** for the new UI version.

---

## File Structure

The UI versions are organized in a clear, hierarchical structure:

~/iot/ui-versions/
├── v1/src/          # Stable production version
├── v2/src/          # Enhanced version with improvements
├── v3/src/          # New development version
└── v4/src/          # Future version


---

## URL Pattern

Each UI version is accessible via a distinct and predictable URL pattern:

* **V1:** `https://app.verdegris.eu/v1/dashboard.html`
* **V2:** `https://app.verdegris.eu/v2/dashboard.html`
* **V3:** `https://app.verdegris.eu/v3/dashboard.html`
* **V4:** `https://app.verdegris.eu/v4/dashboard.html`

---

## Development Workflow

This streamlined workflow ensures efficient and safe UI development:

### 1. Create New Version

Initiate a new version from an existing stable or development branch:

```bash
./create-ui-version.sh v2 v3

2. Develop Safely
All edits are made within the new version's directory (e.g., ui-versions/v3/src/).
Changes reflect instantly in the browser.
Crucially, existing versions (V1, V2) remain untouched and stable.
No Docker restarts are required for HTML/CSS/JS modifications.
3. Test Thoroughly
Test all pages within the new version (v3, v4, etc.).
Perform comprehensive comparisons with previous versions.
Verify that no regressions or unexpected behaviors have been introduced.
4. Deploy / Promote
Retain active working versions as stable references for rollback or comparison.
Archive older, no-longer-needed versions periodically.
Safety Features
The ./create-ui-version.sh script is built with robust safety mechanisms:

[!NOTE] Never modifies existing versions

[!NOTE] Automatic backups of Caddyfile

[!NOTE] Validation of version format

[!NOTE] Robust error handling for edge cases

[!NOTE] Live testing immediately after creation

[!NOTE] Automated documentation generation

Recovery Procedure
In case of any issues, follow these steps to recover:
# Restore Caddyfile from a recent backup
cp unified-caddyfile.backup.YYYYMMDD_HHMMSS unified-caddyfile
docker compose restart reverse-proxy

# Remove the broken or problematic version directory
rm -rf ui-versions/vX

Best Practices
Adhering to these best practices will optimize your workflow:

Always test new versions extensively before integrating major changes.
Maintain v1 as a reliable stable fallback.
Document development notes clearly and descriptively.
Create new versions before undertaking any high-risk experiments.
Regularly clean up and remove old experimental versions.
Practical Examples
Create V3 for Modal Improvements
Bash

./create-ui-version.sh v2 v3
Action: Edit the modal component within v3/src/locations.html.
Test URL: https://app.verdegris.eu/v3/locations.html
Create V4 for a Major Redesign
Bash

./create-ui-version.sh v2 v4 # Start from stable v2 for a fresh slate
Action: Implement major design changes within v4/src/.
Benefit: Keep v2 as a completely stable fallback during the redesign.
Create V5 from Enhanced V3
Bash

./create-ui-version.sh v3 v5 # Build upon the improvements made in v3
Action: Continue iterating and adding features, leveraging v3's enhancements.
Now You Can Safely Create New Versions!
Execute the script to effortlessly create new UI versions:

Bash

# Example: Test creating v3 from v2
./create-ui-version.sh v2 v3
This script ensures:

[!NOTE] Zero breaking changes to existing versions.

[!NOTE] An instant, working copy of your chosen source version.

[!NOTE] Automatic routing setup for immediate accessibility.

[!NOTE] Live file editing capabilities, ready immediately.

[!NOTE] Documentation auto-generation to keep records up-to-date.

[!NOTE] Comprehensive safety validations built-in.

This workflow is perfect for rapid iteration while maintaining unparalleled stability! 🚀
