# Super Scale Node Cluster Queues Proxy

This project demonstrates scaling a Node.js application using TypeScript and Bun.js with the help of clusters, PM2, and message queues with BullMQ.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/SJ22032003/super-scale-node-cluster-queues-proxy.git
  cd super-scale-node-cluster-queues-proxy
  ```

2. Install dependencies:
  ```sh
  bun install
  ```

3. Set up environment variables:
  ```sh
  cp .env.example .env
  # Update .env with your configuration
  ```

## Usage

1. Start the application using PM2:
  ```sh
  pm2 start ecosystem.config.js
  ```

2. Monitor the application:
  ```sh
  pm2 monit
  ```

## Features

- **Clustering**: Utilizes Node.js clusters to take advantage of multi-core systems.
- **PM2**: Manages and monitors the application processes.
- **BullMQ**: Implements message queues for handling background jobs and tasks.

