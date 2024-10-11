# DFC Bot

DFC Bot is a Discord bot for managing the Diablo Fighting Championship (DFC) roster. It helps users register for events, update information, and interact with the DFC community.

## Features

- **Register Command**: Allows users to register for the DFC roster.
- **Signup Command**: Allows users to sign up for weekly DFC events.
- **Google Sheets Integration**: Stores all roster information in a Google Spreadsheet for easy management and tracking.
- **Role Management**: Automatically assigns the `@DFC Dueler` role to registered users.

## Commands

### `/register`

- **Description**: Register for the DFC roster.
- **Usage**: `/register character_name:<Character Name>`
- **Options**:
  - `character_name`: Enter your in-game character name.
- **Behavior**:
  - Registers the user in the DFC roster stored in Google Sheets.
  - If the user is already registered, they will receive a notification.
  - Assigns the `@DFC Dueler` role if not already assigned.
  - Sends a confirmation message in the form of an embedded message with successful registration details.

### `/signup`

- **Description**: Sign up for the weekly DFC event.
- **Usage**: `/signup character_name:<Character Name>`
- **Options**:
  - `character_name`: Enter your in-game character name.
- **Behavior**:
  - Signs up the user for the weekly event and stores the information in the Google Sheet under the `Weekly Signups` tab.
  - Sends a confirmation message if the signup is successful.
  - If the user is already signed up, they will be notified.

## Setup Instructions

### Prerequisites

- **Node.js** and **npm** installed.
- **Google Service Account** with credentials JSON file for accessing Google Sheets.
- **Discord Bot Token**.

### Installation

1. Clone this repository.
   ```sh
   git clone <repository_url>
   ```
2. Navigate to the project directory.
   ```sh
   cd DFC-bot
   ```
3. Install dependencies.
   ```sh
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory and add the following:
   ```env
   DISCORD_TOKEN=<Your_Discord_Bot_Token>
   GOOGLE_SHEET_ID=<Your_Google_Sheet_ID>
   ```
2. Add your Google Service Account credentials to `config/credentials.json` (ensure it is added to `.gitignore` to avoid exposing it).

### Running the Bot

1. Start the bot using the following command:
   ```sh
   npm run start
   ```

## Google Sheets Setup

- The bot uses a Google Sheet to store DFC roster information.
- The sheet should have the following columns:
  - `Arena Name`, `Discord Name`, `Discord User ID`, `Battle Tag`, `DFC Role`, `Champion`, `Current Champ`, `Titles`, `Notes`, `Leave Status`.

## Permissions

- Users require the `@DFC Dueler` role to register and participate.
- The bot will automatically assign this role upon successful registration if not already assigned.

## Error Handling

- If an error occurs during registration or signup (e.g., issues accessing Google Sheets), the bot will notify the user to try again later.

## Contributing

- Contributions are welcome! Feel free to submit pull requests to improve the bot.

## License

- This project is licensed under the MIT License.

## Troubleshooting

- **Credentials Issue**: Ensure `config/credentials.json` is added to `.gitignore` and not tracked by Git to avoid exposing sensitive information.
- **Push Issues**: If GitHub blocks a push due to secrets, remove credentials from history and ensure they are properly ignored.
