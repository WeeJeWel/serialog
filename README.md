# serialog

A small utility to write a serial device's output to a log file with timestamps.

## Installation

```bash
npm install --global serialog
```

## Usage

```bash
serialog \
  --dev-path=/dev/ttyUSB0 \        # Path to input device
  --dev-baud=115200 \              # Baudrate
  --log-path="~/my_device.log" \   # Path to output file
  --log-append                     # Append to file, instead of overwriting
  ```

### Usage with PM2

Use serialog in combination with [PM2](https://pm2.keymetrics.io) to keep monitoring while detaching your SSH session.

```bash
pm2 start serialog -- --dev-path=/dev/ttyUSB0 --dev-baud=115200 --log-path=/home/pi/my_device.log --log-append
```