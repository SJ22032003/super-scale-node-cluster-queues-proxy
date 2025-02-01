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

3. Make sure to add redis

## Usage

1. Start the application using PM2:
  ```sh
  pm2 start ecosystem.config.js
  ```

2. Monitor the application:
  ```sh
  pm2 monit
  ```

## Presentation

![Screenshot from 2025-02-01 13-02-43](https://github.com/user-attachments/assets/9a4318ae-073e-4c5c-bea2-e4c74cd505bd)
![Screenshot from 2025-01-31 19-46-09](https://github.com/user-attachments/assets/fa5ba05e-54a6-4a5a-9f74-76b7dee2ce2c)
![Screenshot from 2025-01-31 17-57-15](https://github.com/user-attachments/assets/c92bf5da-bdfb-4eb8-9e98-17ad15816705)

## Features

- **Clustering**: Utilizes Node.js clusters to take advantage of multi-core systems.
- **PM2**: Manages and monitors the application processes.
- **BullMQ**: Implements message queues for handling background jobs and tasks.

