# NeuroMail

NeuroMail is a web-based email client that uses temporary disposable email addresses for testing and development purposes. The application leverages the MailSlurp API to create temporary inboxes, receive emails, and manage attachments.

## Features

- Create temporary email inboxes
- Receive and view emails with HTML, Markdown, or plain text support
- View and download email attachments
- Mobile-friendly responsive design
- Multilingual support (Russian/English)
- Custom API key integration option

## Technologies

- Pure JavaScript (no frameworks)
- HTML5 & CSS3
- MailSlurp API integration

## Getting Started

1. Clone the repository
2. Open the project directory
3. Run `npx serve` to start a local server
4. Navigate to the provided URL in your browser

## Usage

- Click "Create New" to generate a temporary inbox
- Inbox addresses can be copied and used to receive emails for testing
- Click on an inbox to view received emails
- Click on an email to view its contents and attachments

## Note

The application uses a public API key with limited capacity. For extended usage, you can set up your own MailSlurp API key in the settings. 