# 🎬 Cineplex Movie Monitor

A TypeScript-based monitoring tool that automatically tracks new movie releases and showtimes at nearby Cineplex theatres, sending email notifications when your tracked movies become available for booking.

## Features

- 📅 **Track New Bookable Movies** - Get notified when movies become available for booking
- 🎬 **Monitor Movie Announcements** - Stay updated on newly announced releases
- 🎟️ **Personal Watchlist** - Track specific movies you want to watch
- 🎭 **Location-Based** - Automatically finds theatres near your postal code
- 📧 **Email Notifications** - Receive formatted email alerts with all updates

## Prerequisites

- Gmail account with App Password for sending notifications
- Cineplex API subscription key

### Setup Steps

#### 1. Clone the repository

```bash
git clone <repo-url>
cd cineplex-monitor
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create environment configuration file

Copy the example environment file:

```bash
cd src
cp .env.example .env
```

#### 4. Configure your environment variables

Open the `.env` file in your favorite text editor and fill in your details:

```env
# Email configuration
DESTINATION_EMAIL=your.email@gmail.com   # Where to receive notifications
SMTP_USER=your.email@gmail.com           # Gmail account for sending emails
SMTP_PASS=abcd efgh ijkl mnop            # Gmail App Password (16 characters, no spaces)

# Cineplex API configuration
API_SUBSCRIPTION_KEY=your-cineplex-api-key-here

# Location settings
LATITUDE=45.56074
LONGITUDE=-73.55248

# Movie tracking (comma-separated movie IDs)
TRACKED_MOVIE_IDS=1234,1235,1246
```

#### 5. Run the script

```bash
cd src
npx tsx index.ts
```

#### 6. Build the binary

**For Linux:**
```bash
cd src
bun build index.ts --compile --target=bun-linux-x64 --outfile cineplex-notifier
```

**For Windows:**
```bash
cd src
bun build index.ts --compile --target=bun-windows-x64 --outfile cineplex-notifier.exe
```

## 6. Build standalone binary (optional)

Compile to a single executable with no dependencies:

### For Linux

```bash
cd src
bun build index.ts --compile --target=bun-linux-x64 --outfile cineplex-notifier
chmod +x cineplex-notifier
./cineplex-notifier
```

### For Windows

```bash
cd src
bun build index.ts --compile --target=bun-windows-x64 --outfile cineplex-notifier.exe
cineplex-notifier.exe
```

**Note**: The binary still requires the `.env` file in the same directory.

#### 7. Set up automated execution (cron, Task Scheduler, etc.)
