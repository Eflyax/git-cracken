Git-Cracken

A modern, web-based Git GUI inspired by GitKraken. > Manage your repositories from any browser, anywhere—local or remote.

📖 About

Git-Cracken is a self-hosted Git client designed to solve the common frustrations with existing tools.

By decoupling the UI from the underlying Git engine using WebSockets, Git-Cracken allows you to run the backend on your machine or a remote headless server, while serving a rich, reactive interface directly to your web browser.

It features a custom-built SVG commit graph (similar to GitKraken's "metro" style) rendered efficiently even for large histories.

✨ Key Features

		🌐 Browser-based UI: No need to install heavy desktop applications. If you have a browser, you have a Git client.

		📡 Remote-First Architecture:

				Keep your code on the server.

				Run the backend agent on your remote VPS/Dev server.

				Connect via the web UI and manage the repo as if it were local.

		🎛 Multi-Server Management: One frontend instance can connect to multiple remote backends. Switch between your Localhost, Staging, and Production environments seamlessly.

		⚡ Real-time Updates: Powered by WebSockets, file changes and git status updates are pushed to the UI instantly.

		🎨 Beautiful History Graph: Custom SVG rendering engine for a clear, readable commit history (no rigid DOM limitations).

		💸 Free & Open Source: No subscription fees for advanced features.

🛠 Tech Stack

		Frontend: Vue.js 3 (Composition API), SVG for graph rendering.

		Backend: Node.js, Socket.io.

		Communication: WebSockets (Real-time bidirectional communication).

		Git Integration: Native git binary execution (spawn/exec).
